(function ($) {
    "use strict";

    $(document).ready(function($){
        
        // Mobile Menu Toggle
        $('.mobile-menu-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = $('.mobile-menu-overlay').hasClass('active');
            if (isOpen) {
                $('body').removeClass('menu-open');
                $('.mobile-menu-overlay').removeClass('active');
                $(this).removeClass('open');
                $(this).find('i').removeClass('fa-times').addClass('fa-bars');
            } else {
                $('body').addClass('menu-open');
                $('.mobile-menu-overlay').addClass('active');
                $(this).addClass('open');
                $(this).find('i').removeClass('fa-bars').addClass('fa-times');
            }
        });

        // Close mobile menu when clicking overlay background
        $('.mobile-menu-overlay').on('click', function(e) {
            if (e.target === this) {
                $('body').removeClass('menu-open');
                $('.mobile-menu-overlay').removeClass('active');
                $('.mobile-menu-toggle').removeClass('open')
                    .find('i').removeClass('fa-times').addClass('fa-bars');
            }
        });

        // Prevent overlay from blocking clicks on menu items
        $('.mobile-menu-container').on('click', function(e) {
            e.stopPropagation();
        });

        // Close mobile menu when clicking on a nav link
        $('.mobile-menu-nav a').on('click', function() {
            var href = $(this).attr('href');
            $('body').removeClass('menu-open');
            $('.mobile-menu-overlay').removeClass('active');
            $('.mobile-menu-toggle').removeClass('open')
                .find('i').removeClass('fa-times').addClass('fa-bars');
            if (href && href !== '#') {
                window.location.href = href;
            }
        });

        // Mobile Language Toggle
        $('.mobile-language-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $opts = $('.mobile-language-options');
            $opts.slideToggle(250);
            $(this).find('.fa-chevron-down').toggleClass('rotated');
        });

        // Language toggle functionality
        $('.lang-option').on('click', function(e) {
            e.preventDefault();
            const selectedLang = $(this).data('lang');
            applyLanguage(selectedLang);
            localStorage.setItem('lang', selectedLang);
            // Close mobile menu after language change
            $('body').removeClass('menu-open');
            $('.mobile-menu-overlay').removeClass('active');
            $('.mobile-language-options').slideUp(300);
        });

        function applyLanguage(selectedLang) {
            // Update active states
            $('.lang-option').removeClass('active');
            $(`.lang-option[data-lang="${selectedLang}"]`).addClass('active');

            if (selectedLang === 'ar') {
                $('html').attr('dir', 'rtl').attr('lang', 'ar');
                $('body').addClass('rtl');
                $('[data-ar]').each(function() {
                    const $this = $(this);
                    const arabicText = $this.data('ar');
                    if (arabicText) {
                        if ($this.is('input') || $this.is('textarea')) {
                            const arabicPlaceholder = $this.data('ar-placeholder');
                            if (arabicPlaceholder) $this.attr('placeholder', arabicPlaceholder);
                        } else {
                            $this.text(arabicText);
                        }
                    }
                });
            } else {
                $('html').attr('dir', 'ltr').attr('lang', 'en');
                $('body').removeClass('rtl');
                $('[data-en]').each(function() {
                    const $this = $(this);
                    const englishText = $this.data('en');
                    if (englishText) {
                        if ($this.is('input') || $this.is('textarea')) {
                            const englishPlaceholder = $this.data('en-placeholder');
                            if (englishPlaceholder) $this.attr('placeholder', englishPlaceholder);
                        } else {
                            $this.text(englishText);
                        }
                    }
                });
            }
        }

        // Apply saved language on page load
        const savedLang = localStorage.getItem('lang') || 'en';
        applyLanguage(savedLang);
        
        // testimonial sliders
        $(".testimonial-sliders").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    items:1,
                    nav:false
                },
                1000:{
                    items:1,
                    nav:false,
                    loop:true
                }
            }
        });

        // homepage slider
        $(".homepage-slider").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            nav: true,
            dots: false,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive:{
                0:{
                    items:1,
                    nav:false,
                    loop:true
                },
                600:{
                    items:1,
                    nav:true,
                    loop:true
                },
                1000:{
                    items:1,
                    nav:true,
                    loop:true
                }
            }
        });

        // logo carousel
        $(".logo-carousel-inner").owlCarousel({
            items: 4,
            loop: true,
            autoplay: true,
            margin: 30,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    items:3,
                    nav:false
                },
                1000:{
                    items:4,
                    nav:false,
                    loop:true
                }
            }
        });

        // count down
        if($('.time-countdown').length){  
            $('.time-countdown').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
                var $this = $(this).html(event.strftime('' + '<div class="counter-column"><div class="inner"><span class="count">%D</span>Days</div></div> ' + '<div class="counter-column"><div class="inner"><span class="count">%H</span>Hours</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%M</span>Mins</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%S</span>Secs</div></div>'));
            });
         });
        }

        // projects filters isotop
        $(".product-filters li").on('click', function () {
            
            $(".product-filters li").removeClass("active");
            $(this).addClass("active");

            var selector = $(this).attr('data-filter');

            $(".product-lists").isotope({
                filter: selector,
            });
            
        });
        
        // isotop inner
        $(".product-lists").isotope();

        // magnific popup
        $('.popup-youtube').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        // light box
        $('.image-popup-vertical-fit').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }
        });

        // homepage slides animations
        $(".homepage-slider").on("translate.owl.carousel", function(){
            $(".hero-text-tablecell .subtitle").removeClass("animated fadeInUp").css({'opacity': '0'});
            $(".hero-text-tablecell h1").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
            $(".hero-btns").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
        });

        $(".homepage-slider").on("translated.owl.carousel", function(){
            $(".hero-text-tablecell .subtitle").addClass("animated fadeInUp").css({'opacity': '0'});
            $(".hero-text-tablecell h1").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
            $(".hero-btns").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
        });

       

        // stikcy js - desktop only
        if ($(window).width() >= 992) {
            $("#sticker").sticky({
                topSpacing: 0
            });
        }

        //mean menu
        $('.main-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: "992"
        });
    
    });


    jQuery(window).on("load",function(){
        jQuery(".loader").fadeOut(1000);
    });


}(jQuery));
