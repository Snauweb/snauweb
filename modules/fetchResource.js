export { apiFetch }

let config = undefined;
let configRead = false;

function readConfig(path="/snauweb/config/apiConfig.json") {
  return fetch(path)
    .then(response => response.json())
    .then(data => {
      let newConfig = {
	URI: data.debug === "true" ? data.debugURI : data.apiURI 
      }
      configRead = true;
      return newConfig;
    });
}

// Fetch from api addres specified in apiConfig.json
async function apiFetch(path, params={method: 'GET', credentials: 'include'}) {
  
  // The config must be read before the request can be performed
  // Asynch read of config, then recursivly call function with config (hopefully)
  // not undefined
  if(configRead) {
    
    // Construct full path, using base URI from config
    let fullPath = config.URI + path;
    return fetch(fullPath, params);
  }

  // Config must be read before any fetches
  else {
    config = await readConfig();
    return apiFetch(path, params);
  }
}
