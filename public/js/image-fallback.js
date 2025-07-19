/**
 * Handle image loading errors and provide fallbacks
 */
document.addEventListener('DOMContentLoaded', function() {
  // Set fallback for all images that might fail to load
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Skip images that already have error handlers
    if (img.hasAttribute('onError')) return;
    
    img.addEventListener('error', function() {
      console.log(`Image failed to load: ${img.src}`);
      
      // Add placeholder class to show loading state
      this.classList.add('loading');
      
      // For generic images, try WebP fallback if possible
      if (img.src.includes('.jpg') || img.src.includes('.jpeg') || img.src.includes('.png')) {
        const fallbackSrc = img.getAttribute('data-fallback');
        if (fallbackSrc) {
          console.log(`Trying fallback image: ${fallbackSrc}`);
          img.src = fallbackSrc;
          return;
        }
      }
      
      // For unsplash images that fail to load
      if (img.src.includes('unsplash.com')) {
        // Try a different format/size parameter
        const currentUrl = new URL(img.src);
        if (!currentUrl.searchParams.has('fm')) {
          currentUrl.searchParams.set('fm', 'webp');
        }
        
        // Ensure we have width parameter
        if (!currentUrl.searchParams.has('w')) {
          const containerWidth = img.parentElement?.clientWidth || 1200;
          currentUrl.searchParams.set('w', Math.min(containerWidth * 2, 2000).toString());
        }
        
        // Add quality parameter if missing
        if (!currentUrl.searchParams.has('q')) {
          currentUrl.searchParams.set('q', '80');
        }
        
        console.log(`Trying optimized Unsplash URL: ${currentUrl.toString()}`);
        img.src = currentUrl.toString();
      } 
      // For logo images that fail to load
      else if (img.src.includes('/logo/')) {
        // Replace with standard logo if it's a specialized logo version
        if (img.src.includes('logo-') && !img.src.includes('logo-full-color')) {
          img.src = '/logo/logo-full-color.svg';
          img.alt = 'Standard Logo';
        }
      }
      // For profile image that fails
      else if (img.src.includes('photo-1507003211169')) {
        // Use placeholder image for profile
        img.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&auto=format&fit=crop&q=60&fm=webp';
        
        // If that also fails, use a generic avatar
        img.onerror = function() {
          this.onerror = null;
          this.src = 'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?bg=fff';
          this.alt = 'Profile placeholder';
        };
      }
      // For general errors, provide a simple colored placeholder
      else {
        this.classList.add('fallback-image');
        this.classList.remove('loading');
      }
    });
  });
  
  // For responsive image components - handle loading state
  document.querySelectorAll('.responsive-image').forEach(img => {
    img.addEventListener('load', function() {
      // Remove loading state and show the loaded image
      this.classList.remove('loading');
      this.classList.add('loaded');
      
      // Hide the placeholder if it exists
      const placeholder = this.parentElement?.querySelector('.img-placeholder');
      if (placeholder) {
        placeholder.classList.add('hidden');
      }
    });
  });
});

// Add event listener to resize observer to handle responsive images
if (window.ResizeObserver) {
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const container = entry.target;
      const images = container.querySelectorAll('img[srcset]');
      
      images.forEach(img => {
        // Update sizes attribute based on container width
        const containerWidth = container.clientWidth;
        img.sizes = `${containerWidth}px`;
      });
    });
  });
  
  // Observe all responsive image containers
  document.querySelectorAll('.responsive-image-container').forEach(container => {
    observer.observe(container);
  });
}