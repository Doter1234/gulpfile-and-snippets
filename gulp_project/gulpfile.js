const
	project_folder = require("path").basename(__dirname),// dist or app
	{ src, dest, parallel, series, watch } = require('gulp'),

	path = {
		src: {
			// html: source_folder + "/*.html",// [source_folder + "/*.html", "!"+source_folder + "/_*.html"]
			img: "src/img/**/*.+(png|jpg|gif|ico|svg|webp)",//     /*.{jpg, jpeg, png, svg, gif, ico, webp}
		}
	},

	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify-es').default,
	del = require('del'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	fileinclude = require('gulp-file-include'),
	gutil = require('gulp-util'),
	ftp = require('vinyl-ftp'),
	sourcemaps = require('gulp-sourcemaps'),
	notify = require('gulp-notify'),
	svgSprite = require('gulp-svg-sprite'),
	webpack = require('webpack'),
	webpackStream = require('webpack-stream'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	fs = require('fs'),
	rev = require('gulp-rev'),
	revRewrite = require('gulp-rev-rewrite'),
	revdel = require('gulp-rev-delete-original'),
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	htmlmin = require('gulp-htmlmin');

// DEV
//svg sprite
const svgSprites = () => {
	return src('./src/img/svg/**.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg" //sprite file name
				}
			},
		}))
		.pipe(dest(project_folder + '/img'));
}

const resources = () => {
	return src('./src/resources/**')
		.pipe(dest(project_folder))
}

const imgToApp = () => {
	return src(path.src.img)// ['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/*.svg']
		.pipe(dest(project_folder + '/img'))
}

const htmlInclude = () => {
	return src(['./src/*.html'])
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(dest(project_folder))
		.pipe(browserSync.stream());
}

const fonts = () => {
	src('./src/fonts/**/**.otf')
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(project_folder + '/fonts/'));
	return src('./src/fonts/**/**.ttf')
		.pipe(ttf2woff2())
		.pipe(dest(project_folder + '/fonts/'));
}

const checkWeight = (fontname) => {
	let weight = 400;
	switch (true) {
		case /Thin/.test(fontname):
			weight = 100;
			break;
		case /ExtraLight/.test(fontname):
			weight = 200;
			break;
		case /Light/.test(fontname):
			weight = 300;
			break;
		case /Regular/.test(fontname):
			weight = 400;
			break;
		case /Medium/.test(fontname):
			weight = 500;
			break;
		case /SemiBold/.test(fontname):
			weight = 600;
			break;
		case /Semi/.test(fontname):
			weight = 600;
			break;
		case /Bold/.test(fontname):
			weight = 700;
			break;
		case /ExtraBold/.test(fontname):
			weight = 800;
			break;
		case /Heavy/.test(fontname):
			weight = 700;
			break;
		case /Black/.test(fontname):
			weight = 900;
			break;
		default:
			weight = 400;
	}
	return weight;
}

const cb = () => { }

let srcFonts = './src/scss/_fonts.scss';
let appFonts = project_folder + '/fonts/';

const fontsStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				let font = fontname.split('-')[0];
				let weight = checkWeight(fontname);

				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ');\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}

const styles = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(project_folder + '/css/'))
		.pipe(browserSync.stream());
}

const scripts = () => {
	return src('./src/js/main.js')
		.pipe(webpackStream(
			{
				mode: 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}]
				},
			}
		))
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end'); // Don't stop the rest of the task
		})

		.pipe(sourcemaps.init())
		.pipe(uglify().on("error", notify.onError()))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(project_folder + '/js'))
		.pipe(browserSync.stream());
}

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: project_folder
		},
	});

	watch('./src/scss/**/*.scss', styles);
	watch('./src/js/**/*.js', scripts);
	watch('./src/html/**/*.html', htmlInclude);
	watch('./src/*.html', htmlInclude);
	watch('./src/resources/**', resources);
	watch('./src/img/**.jpg', imgToApp);
	watch('./src/img/**.jpeg', imgToApp);
	watch('./src/img/**.png', imgToApp);
	watch('./src/img/svg/**.svg', svgSprites);
	watch('./src/fonts/**', fonts);
	watch('./src/fonts/**', fontsStyle);
}

const clean = () => {
	return del([project_folder + '/*'])
}

exports.fileinclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.watchFiles = watchFiles;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;

exports.default = series(clean, parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);

// BUILD
const images = () => {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			})
		)
		.pipe(dest(project_folder + '/img'))
		.pipe(src(path.src.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3 // 0 to 7
		}))
		.pipe(dest(project_folder + '/img'))
		.pipe(browserSync.stream());
}

const stylesBuild = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(dest(project_folder + '/css/'))
}

const scriptsBuild = () => {
	return src('./src/js/main.js')
		.pipe(webpackStream(

			{
				mode: 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}]
				},
			}))
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end'); // Don't stop the rest of the task
		})
		.pipe(uglify().on("error", notify.onError()))
		.pipe(dest(project_folder + '/js'))
}

const cache = () => {
	return src(project_folder + '/**/*.{html,css,js,svg,png,jpg,jpeg,webp,woff2}', {
		base: project_folder
	})
		.pipe(rev())
		.pipe(revdel())
		.pipe(dest(project_folder))
		.pipe(rev.manifest('rev.json'))
		.pipe(dest(project_folder));
};

const rewrite = () => {
	const manifest = src(project_folder + '/rev.json');

	return src(project_folder + '/**/*.html')
		.pipe(revRewrite({
			manifest
		}))
		.pipe(dest(project_folder));
}

const htmlMinify = () => {
	return src(project_folder + '/**/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(project_folder));
}

exports.build = series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild, htmlMinify, images, cache, rewrite);


// deploy
const deploy = () => {
	let conn = ftp.create({
		host: '',
		user: '',
		password: '',
		parallel: 10,
		log: gutil.log
	});

	let globs = [
		project_folder + '/**',
	];

	return src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer('')) // only upload newer files
		.pipe(conn.dest(''));
}

exports.deploy = deploy;
