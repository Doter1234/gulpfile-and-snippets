
// data-scroll="#about"

$(function () {

	var header = $("#header"),
		introH = $("#intro").innerHeight(),
		scrollOffset = $(window).scrollTop();// Current scroll


	/* Fixed Header */
	checkScroll(scrollOffset);

	$(window).on("scroll", function () {
		scrollOffset = $(this).scrollTop();// update value scrollOffset

		checkScroll(scrollOffset);
	});

	function checkScroll(scrollOffset) {
		if (scrollOffset >= introH) {
			header.addClass("fixed");
		} else {
			header.removeClass("fixed");
		}
	}



	/* Smooth scroll */
	$("[data-scroll]").on("click", function (event) {
		event.preventDefault();// Отмена стандартного поведения ссылки

		var blockId = $(this).data('scroll'),
			blockOffset = $(blockId).offset().top;// отступ

		$("#nav a").removeClass("active");
		$(this).addClass("active");

		$("html, body").animate({
			scrollTop: blockOffset
		}, 500);
	});



	/* Menu nav toggle */
	$("#nav_toggle").on("click", function (event) {
		event.preventDefault();

		$(this).toggleClass("active");
		$("#nav").toggleClass("active");
	});

});