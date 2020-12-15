// function ibg() {
// 	$.each($('.ibg'), (i, val) => {
// 		if ($(this).find('img').length > 0) {
// 			$(this).css('background-image',
// 				'url(../'
// 				+ $(this).find("img").attr("src") +
// 				')');
// 		}
// 	});
// }
// ibg();
function isInternetExplorer() {
	return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}
function ibg() {
	if (isInternetExplorer()) {
		let ibg = document.querySelectorAll('.ibg');
		for (let i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelectorAll('img')) {
				ibg[i].style.backgroundImage = 'url(../' + ibg[i].querySelector("img").getAttribute("src") + ')';
			}
		}
	}
}
ibg();