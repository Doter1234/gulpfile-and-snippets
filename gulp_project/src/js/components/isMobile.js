let isMobile = {
	Android: () => { return navigator.userAgent.match(/Android/i); },
	BlackBerry: () => { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: () => { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: () => { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: () => { return navigator.userAgent.match(/IEMobile/i); },
	any: () => { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

if (isMobile.any()) {
	document.body.classList.add('touch')
	let arrow = document.querySelectorAll('.arrow');
	for (let i = 0; i < arrow.length; i++) {
		let nextSubmenu = arrow[i].nextElementSibling;
		arrow[i].addEventListener('click', () => {
			nextSubmenu.classList.toggle('open');
			arrow[i].classList.toggle('active');
		});
	}
} else {
	document.body.classList.add('mouse');
}