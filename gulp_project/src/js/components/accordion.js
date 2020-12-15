
//let i = 0, acc = document.querySelectorAll('.accordion');
//for (i; i < acc.length; i++) {
//	acc[i].addEventListener('click', () => {
//		this.classList.toggle('active');
//		this.nextElementSibling.classList.toggle('show');
//	})
//}

// data-collapse="#wedo_1"

$(function () {
	/* Collapse */
	$("[data-collapse]").on("click", function (event) {
		event.preventDefault();
		var $this = $(this),
			blockId = $this.data('collapse');
		// $this.toggleClass("active");
		$(blockId).slideToggle();
	});
});

// Accordion
document.querySelectorAll('.accordion').forEach(item => {
	item.addEventListener('click', () => {
		this.classList.toggle('active');
		this.nextElementSibling.classList.toggle('show');
	});
});
