let tabNav = document.querySelectorAll('.tabs__nav'),
	tabContent = document.querySelectorAll('.tabs__content');
tabNav.forEach((el) => {
	el.addEventListener('click', activeTab)
});
function activeTab() {
	tabNav.forEach((el) => {
		el.classList.remove('active');
	});
	this.classList.add('active');
	let tabName = this.getAttribute('data-tab');
	activeTabContent(tabName);
}
function activeTabContent(tabName) {
	tabContent.forEach((item) => {
		item.classList.contains(tabName) ? item.classList.add('active') : item.classList.remove('active');
	});
}