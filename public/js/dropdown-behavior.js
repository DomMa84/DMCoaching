/**
 * Enhanced dropdown behavior for desktop and mobile navigation
 */
document.addEventListener('DOMContentLoaded', () => {
  // Desktop dropdown for services
  const setupDesktopDropdown = () => {
    const servicesDropdownButton = document.getElementById('services-dropdown-button');
    const servicesDropdown = document.getElementById('services-dropdown');
    
    if (!servicesDropdownButton || !servicesDropdown) return;
    
    let isDropdownOpen = false;
    
    // Function to open the dropdown
    const openDropdown = () => {
      servicesDropdown.classList.remove('hidden');
      servicesDropdownButton.setAttribute('aria-expanded', 'true');
      servicesDropdownButton.querySelector('svg').classList.add('rotate-180');
      isDropdownOpen = true;
    };
    
    // Function to close the dropdown
    const closeDropdown = () => {
      servicesDropdown.classList.add('hidden');
      servicesDropdownButton.setAttribute('aria-expanded', 'false');
      servicesDropdownButton.querySelector('svg').classList.remove('rotate-180');
      isDropdownOpen = false;
    };
    
    // Toggle dropdown on button click
    servicesDropdownButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (isDropdownOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });
    
    // Add click event to all dropdown items to close when selected
    const dropdownItems = servicesDropdown.querySelectorAll('a');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        closeDropdown();
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (isDropdownOpen && 
          !servicesDropdownButton.contains(event.target) && 
          !servicesDropdown.contains(event.target)) {
        closeDropdown();
      }
    });
    
    // Close dropdown when pressing escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        closeDropdown();
      }
    });
    
    // Hover behavior with intent detection
    const dropdownMenu = document.querySelector('.dropdown-menu');
    let hoverTimeout;
    let isMouseOverMenu = false;
    
    // Track mouse over menu state
    dropdownMenu.addEventListener('mouseenter', () => {
      isMouseOverMenu = true;
      clearTimeout(hoverTimeout);
      if (!isDropdownOpen) {
        openDropdown();
      }
    });
    
    dropdownMenu.addEventListener('mouseleave', () => {
      isMouseOverMenu = false;
      clearTimeout(hoverTimeout);
      
      // Small delay to prevent accidental closing
      hoverTimeout = setTimeout(() => {
        if (!isMouseOverMenu) {
          closeDropdown();
        }
      }, 150);
    });
  };
  
  // Setup for mobile accordion behavior
  const setupMobileAccordion = () => {
    const mobileDropdownButtons = document.querySelectorAll('.mobile-dropdown button');
    
    mobileDropdownButtons.forEach(button => {
      button.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('.mobile-dropdown-icon');
        
        // Update aria-expanded attribute
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', (!expanded).toString());
        
        // Toggle the content visibility with animation
        if (expanded) {
          // Closing the dropdown
          icon.classList.remove('rotate-180');
          
          // Set explicit height before transitioning to 0
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.overflow = 'hidden';
          
          // Force reflow
          void content.offsetHeight;
          
          // Animate closing
          content.style.maxHeight = '0px';
          
          // After animation completes, add hidden class and clean up styles
          setTimeout(() => {
            content.classList.add('hidden');
            content.style.maxHeight = '';
            content.style.overflow = '';
          }, 300);
        } else {
          // Opening the dropdown
          content.classList.remove('hidden');
          content.style.maxHeight = '0px';
          content.style.overflow = 'hidden';
          
          // Force reflow
          void content.offsetHeight;
          
          // Animate opening
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.classList.add('rotate-180');
          
          // After animation completes, clean up styles
          setTimeout(() => {
            content.style.maxHeight = '';
            content.style.overflow = '';
          }, 300);
        }
      });
    });
  };
  
  // Initialize all dropdown behaviors
  setupDesktopDropdown();
  setupMobileAccordion();
});