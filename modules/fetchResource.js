export { apiFetch };
import { config } from '../config/apiConfig.js';

let apiURI = undefined;

function readConfig() {
  if(config.debug === "true") {
    apiURI = config.debugURI;
  }
  else {
    apiURI = config.apiURI;
  }
}

// Fetch from api addres specified in apiConfig.json
async function apiFetch(path, params={method: 'GET', credentials: 'include'}) {
  
  // The config must be read before the request can be performed
  // Asynch read of config, then recursivly call function with config (hopefully)
  // not undefined
  if(apiURI === undefined) {
    readConfig()
  }
  // Construct full path, using base URI from config
  let fullPath = apiURI + path;
  return fetch(fullPath, params);
}
