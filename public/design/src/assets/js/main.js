// menu 
document.addEventListener('DOMContentLoaded', function() {
  // Variables
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdowns = document.querySelectorAll('.dropdown');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const navIndicator = document.createElement('div');
  const header = document.querySelector('.header');
  const badge = document.querySelector('.badge');
  
  // Setup nav indicator
  navIndicator.classList.add('nav-indicator');
  navMenu.appendChild(navIndicator);
  
  // Set initial position of nav indicator to active link
  setIndicatorPosition(document.querySelector('.nav-link.active'));
  
  // Show notification badge after 2 seconds
  setTimeout(() => {
      badge.classList.add('show');
  }, 2000);
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Toggle hamburger animation
      const bars = document.querySelectorAll('.bar');
      if (menuToggle.classList.contains('active')) {
          bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
      }
  });
  
  // Mobile dropdown toggle
  if (window.innerWidth <= 768) {
      dropdowns.forEach(dropdown => {
          const dropdownLink = dropdown.querySelector('.nav-link');
          dropdownLink.addEventListener('click', function(e) {
              e.preventDefault();
              dropdown.classList.toggle('open');
          });
      });
  }
  
  // Navigation links hover effect
  navLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
          if (window.innerWidth > 768) {
              setIndicatorPosition(this);
          }
      });
      
      link.addEventListener('click', function(e) {
          if (!this.parentElement.classList.contains('dropdown') || window.innerWidth <= 768) {
              e.preventDefault();
              navLinks.forEach(navLink => navLink.classList.remove('active'));
              this.classList.add('active');
              setIndicatorPosition(this);
          }
      });
  });
  
  // Reset indicator position when mouse leaves the nav menu
  navMenu.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
          const activeLink = document.querySelector('.nav-link.active');
          setIndicatorPosition(activeLink);
      }
  });
  
  // Color theme switcher
  themeButtons.forEach(button => {
      button.addEventListener('click', function() {
          const theme = this.getAttribute('data-theme');
          changeColorTheme(theme);
      });
  });
  
  // Scroll effect for header
  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
          header.style.padding = '5px 0';
          header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      } else {
          header.style.padding = '0';
          header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }
  });
  
  // Window resize handler
  window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
          navMenu.classList.remove('active');
          menuToggle.classList.remove('active');
          const bars = document.querySelectorAll('.bar');
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
          
          // Reset dropdowns
          dropdowns.forEach(dropdown => {
              dropdown.classList.remove('open');
          });
          
          // Reset indicator position
          const activeLink = document.querySelector('.nav-link.active');
          setIndicatorPosition(activeLink);
      }
  });
  
  // Function to set nav indicator position
  function setIndicatorPosition(el) {
      if (!el || window.innerWidth <= 768) return;
      
      const width = el.offsetWidth;
      const left = el.offsetLeft;
      
      navIndicator.style.width = `${width}px`;
      navIndicator.style.left = `${left}px`;
  }
  
  // Function to change color theme
  function changeColorTheme(theme) {
      let primaryColor, secondaryColor;
      
      switch(theme) {
          case 'blue':
              primaryColor = '#12c2e9';
              secondaryColor = '#c471ed';
              break;
          case 'green':
              primaryColor = '#11998e';
              secondaryColor = '#38ef7d';
              break;
          case 'purple':
              primaryColor = '#834d9b';
              secondaryColor = '#d04ed6';
              break;
          default: // Default theme
              primaryColor = '#FF5F6D';
              secondaryColor = '#FFC371';
      }
      
      // Update CSS variables
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      
      // Update gradient elements
      const gradientElements = [
          '.logo-icon',
          '.nav-link::before',
          '.nav-indicator',
          '.badge',
          '.theme-btn.active'
      ];
      
      gradientElements.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
              el.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
          });
      });
      
      // Update hover colors
      navLinks.forEach(link => {
          link.style.setProperty('--hover-color', primaryColor);
      });
      
      // Update active link color
      const activeLinks = document.querySelectorAll('.nav-link.active');
      activeLinks.forEach(link => {
          link.style.color = primaryColor;
      });
  }
});


// owl-slider
document.addEventListener('DOMContentLoaded', function () {
  featuredSlider();
});

featuredSlider = ()=> {
  $('.tsf-frozen_slider .owl-carousel, .tsf-motionitem-slider .owl-carousel').owlCarousel({
    loop:true,
    center:true,
    margin:30,
    nav:true,
    dots:true,
    autoplay:false,
    autoplayInterval:10000,
    navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
    }
  })
}

// document.addEventListener('DOMContentLoaded', function () {
//   featuredSlider();
// });

// featuredSlider = ()=> {
//   $('.tsf-testimonialitem-slider .owl-carousel').owlCarousel({
//     loop:true,
//     center:true,
//     margin:30,
//     nav:true,
//     dots:true,
//     autoplay:false,
//     autoplayInterval:10000,
//     navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
//     responsive:{
//         0:{
//             items:1
//         },
//         600:{
//             items:1
//         },
//         1000:{
//             items:1
//         }
//     }
//   })
// }

// sticky menu functionality
$(document).ready(function() {
  let lastScrollTop = 0;
  let ticking = false;

  function updateStickyMenu() {
    const scrollTop = $(window).scrollTop();
    const header = $('header');
    const stickyTabMenu = $('.tsf-sticky-tabmenu');
    const productSection = $('.tsf-our-product');
    const footer = $('.tsf-footer');

    // Add sticky class to header when scrolling down
    if (scrollTop > 100) {
      header.addClass('tsf-header-sticky');
      $('body').addClass('sticky-header');
    } else {
      header.removeClass('tsf-header-sticky');
      $('body').removeClass('sticky-header');
    }

    // Show/hide sticky tab menu only for product section and hide in footer
    if (productSection.length > 0 && footer.length > 0) {
      const productSectionTop = productSection.offset().top;
      const productSectionBottom = productSectionTop + productSection.outerHeight();
      const footerTop = footer.offset().top;
      const headerHeight = header.outerHeight();
      const windowHeight = $(window).height();

      // Check if user is in product section and not in footer area
      const isInProductSection = scrollTop >= productSectionTop - headerHeight - 50;
      const isInFooterArea = scrollTop + windowHeight >= footerTop - 100;

      if (isInProductSection && !isInFooterArea) {
        stickyTabMenu.addClass('show');
      } else {
        stickyTabMenu.removeClass('show');
      }
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateStickyMenu);
      ticking = true;
    }
  }

  $(window).on('scroll', requestTick);

  // Sync sticky tabs with main tabs
  function syncTabs() {
    // When main tabs are clicked, update sticky tabs
    $('.tsf-our-product [role="tablist"] button').on('click', function() {
      const targetId = $(this).data('tabs-target');
      const stickyButton = $('.tsf-sticky-tabmenu [data-tabs-target="' + targetId + '"]');
      
      // Remove active class from all sticky tabs
      $('.tsf-sticky-tabmenu button').removeClass('active').attr('aria-selected', 'false');
      
      // Add active class to corresponding sticky tab
      if (stickyButton.length) {
        stickyButton.addClass('active').attr('aria-selected', 'true');
      }
    });

    // When sticky tabs are clicked, update main tabs
    $('.tsf-sticky-tabmenu button').on('click', function() {
      const targetId = $(this).data('tabs-target');
      const mainButton = $('.tsf-our-product [data-tabs-target="' + targetId + '"]');
      
      // Remove active class from all main tabs
      $('.tsf-our-product [role="tablist"] button').removeClass('active').attr('aria-selected', 'false');
      
      // Add active class to corresponding main tab
      if (mainButton.length) {
        mainButton.addClass('active').attr('aria-selected', 'true');
        
        // Scroll to the main tab section
        const productSection = $('.tsf-our-product');
        if (productSection.length) {
          $('html, body').animate({
            scrollTop: productSection.offset().top - 100
          }, 700);
        }
      }
    });
  }

  syncTabs();
});

// faq
var $titleTab = $('.title_tab');
  $('.accordion_item:eq(0)').find('.title_tab').addClass('active').next().stop().slideDown(300);
  $titleTab.on('click', function(e) {
  e.preventDefault();
    if ( $(this).hasClass('active') ) {
      $(this).removeClass('active');
      $(this).next().stop().slideUp(500);
      $(this).next().find('p').removeClass('show');
    } else {
      $(this).addClass('active');
      $(this).next().stop().slideDown(500);
      $(this).parent().siblings().children('.title_tab').removeClass('active');
      $(this).parent().siblings().children('.inner_content').slideUp(500);
      $(this).parent().siblings().children('.inner_content').find('p').removeClass('show');
      $(this).next().find('p').addClass('show');
    }
});