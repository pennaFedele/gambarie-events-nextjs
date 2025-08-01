// Umami Analytics initialization
export const initUmami = () => {
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  
  // Only load Umami if both URL and website ID are provided
  if (scriptUrl && websiteId) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = scriptUrl;
    script.setAttribute('data-website-id', websiteId);
    
    // Add script to head
    document.head.appendChild(script);
    
    console.log('Umami Analytics initialized');
  } else {
    console.log('Umami Analytics not configured - skipping initialization');
  }
};