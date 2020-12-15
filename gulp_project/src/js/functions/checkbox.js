function isInternetExplorer() {
	return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}
function checkboxIsInternetExplorer() {
	if (isInternetExplorer()) {
		let input = document.querySelectorAll('input');
		for (let i = 0; i < input.length; i++) {
			if (input[i].is(':checkbox')) {
				input[i].addClass('checkbox__is-IE');
			}
		}
	}
}
checkboxIsInternetExplorer();