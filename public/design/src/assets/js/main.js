// utility: detect React/Next environment in a robust, reusable way
function isReactEnv() {
  try {
    return !!(
      document.querySelector('[data-reactroot]') ||
      document.querySelector('#__next') ||
      window.React ||
      document.querySelector('script[src*="next"]') ||
      window.__NEXT_DATA__
    );
  } catch (e) {
    return false;
  }
}

// menu 
document.addEventListener('DOMContentLoaded', function () {
  // Variables
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdowns = document.querySelectorAll('.dropdown');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const header = document.querySelector('.header');
  const badge = document.querySelector('.badge');

  let navIndicator = null;

  // Only create nav indicator if not in React environment
  if (!isReactEnv() && navMenu) {
    navIndicator = document.createElement('div');
    navIndicator.classList.add('nav-indicator');
    navMenu.appendChild(navIndicator);

    // Set initial position of nav indicator to active link
    setIndicatorPosition(document.querySelector('.nav-link.active'));
    console.log('Navigation indicator created by vanilla JS');
  } else {
    console.log('Navigation indicator skipped - React environment detected');
  }

  // Show notification badge after 2 seconds
  if (badge) {
    setTimeout(() => {
      badge.classList.add('show');
    }, 2000);
  }

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Toggle hamburger animation
      const bars = document.querySelectorAll('.bar');
      if (menuToggle.classList.contains('active')) {
        if (bars[0]) bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        if (bars[1]) bars[1].style.opacity = '0';
        if (bars[2]) bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        if (bars[0]) bars[0].style.transform = 'none';
        if (bars[1]) bars[1].style.opacity = '1';
        if (bars[2]) bars[2].style.transform = 'none';
      }
    });
  }

  // Mobile dropdown toggle
  if (window.innerWidth <= 768) {
    dropdowns.forEach(dropdown => {
      const dropdownLink = dropdown.querySelector('.nav-link');
      if (dropdownLink) {
        dropdownLink.addEventListener('click', function (e) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        });
      }
    });
  }

  // Navigation links hover/click effects - skip entirely in React
  if (!isReactEnv()) {
    navLinks.forEach(link => {
      if (link) {
        link.addEventListener('mouseenter', function () {
          if (window.innerWidth > 768) {
            setIndicatorPosition(this);
          }
        });

        link.addEventListener('click', function (e) {
          if (this.parentElement && (!this.parentElement.classList.contains('dropdown') || window.innerWidth <= 768)) {
            e.preventDefault();
            navLinks.forEach(navLink => {
              if (navLink) navLink.classList.remove('active');
            });
            this.classList.add('active');
            setIndicatorPosition(this);
          }
        });
      }
    });
  }

  // Reset indicator position when mouse leaves the nav menu
  if (navMenu) {
    navMenu.addEventListener('mouseleave', function () {
      if (window.innerWidth > 768) {
        const activeLink = document.querySelector('.nav-link.active');
        setIndicatorPosition(activeLink);
      }
    });
  }

  // Color theme switcher
  themeButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', function () {
        const theme = this.getAttribute('data-theme');
        changeColorTheme(theme);
      });
    }
  });

  // Scroll effect for header
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.style.padding = '5px 0';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      } else {
        header.style.padding = '0';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }
    });
  }

  // Window resize handler
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      if (navMenu) navMenu.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
      const bars = document.querySelectorAll('.bar');
      if (bars[0]) bars[0].style.transform = 'none';
      if (bars[1]) bars[1].style.opacity = '1';
      if (bars[2]) bars[2].style.transform = 'none';

      // Reset dropdowns
      dropdowns.forEach(dropdown => {
        if (dropdown) dropdown.classList.remove('open');
      });

      // Reset indicator position
      const activeLink = document.querySelector('.nav-link.active');
      setIndicatorPosition(activeLink);
    }
  });

  // Function to set nav indicator position
  function setIndicatorPosition(el) {
    if (!el || window.innerWidth <= 768 || !navIndicator) return;

    const width = el.offsetWidth;
    const left = el.offsetLeft;

    navIndicator.style.width = `${width}px`;
    navIndicator.style.left = `${left}px`;
  }

  // Function to change color theme
  function changeColorTheme(theme) {
    let primaryColor, secondaryColor;

    switch (theme) {
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
  // featuredSlider();
});

// faq (skip in React environment to avoid hydration conflicts)
document.addEventListener('DOMContentLoaded', function () {
  if (!isReactEnv()) {
    var $titleTab = $('.title_tab');
    $('.accordion_item:eq(0)').find('.title_tab').addClass('active').next().stop().slideDown(300);
    $titleTab.on('click', function (e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
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
  }
});