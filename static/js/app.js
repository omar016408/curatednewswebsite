


$(function () {

	"use strict";

	$(window).on("scroll", function () {
		AOS.init({
			disable: 'mobile',
			duration: 800,
			anchorPlacement: 'center-bottom'
		});
	});
	//===== Mobile Menu 

	$(".navbar-toggler").on('click', function () {
		$(this).toggleClass('active');
	});

	$(".navbar-nav a").on('click', function () {
		$(".navbar-toggler").removeClass('active');
	});


	//===== close navbar-collapse when a  clicked

	$(".navbar-nav a").on('click', function () {
		$(".navbar-collapse").removeClass("show");
	});
	//===== Sticky

	$(window).on('scroll', function (event) {
		var scroll = $(window).scrollTop();
		if (scroll < 10) {
			$(".header-area").removeClass("sticky");
		} else {
			$(".header-area").addClass("sticky");
		}
	});


});


$(function () {
	$("#wizard").steps({
		headerTag: "h4",
		bodyTag: "section",
		transitionEffect: "fade",
		enableAllSteps: true,
		transitionEffectSpeed: 300,
	});
	// Create Steps Image
	$('.steps ul li:first-child').append('<img src="images/" alt="" class="step-arrow">').find('a').append('<img src="static/images/decentralize.png" alt=""> ');
	$('.steps ul li:nth-child(2').append('<img src="images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="static/images/engage.png" alt="">');
	$('.steps ul li:nth-child(3)').append('<img src="images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="static/images/trust.png" alt="">');
	$('.steps ul li:last-child a').append('<img src="static/images/launch.png" alt="">');

});

var btn = $('#button');

$(window).scroll(function () {
	if ($(window).scrollTop() > 300) {
		btn.addClass('show');
	} else {
		btn.removeClass('show');
	}
});

btn.on('click', function (e) {
	e.preventDefault();
	$('html, body').animate({
		scrollTop: 0
	}, '300');
});
