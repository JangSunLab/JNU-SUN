chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed and ready.");
  
    // Example API fetch
    fetch('https://api.publicapis.org/entries')
      .then(response => response.json())
      .then(data => {
        console.log('API Data:', data);
        // Use data in the extension
      })
      .catch(error => console.error('Error fetching API:', error));
  });
  