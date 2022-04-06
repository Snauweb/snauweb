export {
  isValidID,
  hasClass,
  pruneFileExtension,
  getSingleURLParameter,
  getURLParameters
}


// Returns the value of the requested param, or null if it does not exist
function getSingleURLParameter(param) {
  let parameterDict = getURLParameters();

  if (param in parameterDict) {
    return parameterDict[param];
  }

  else {
    return null;
  }
}

// No parameters returns an empty object
function getURLParameters() {
  let result = {};
  let parameterString = window.location.search;
  let decodedParameterString = decodeURIComponent(parameterString);

  
  // No parameter string means just return an empty result
  if(decodedParameterString.length <= 0) {
    return result;
  }
  
  // Should start with a '?'
  if(decodedParameterString[0] !== '?') {
    console.warn('Bad query string: query string not starting with ?');
  }
  else {
    decodedParameterString = decodedParameterString.slice(1); // remove '?'
  }
  
  let keyValuePairs = decodedParameterString.split('&');

  // Ignore key value pairs with more or less than two values after splitting on '='
  for (let keyValuePair of keyValuePairs) {
    let keyAndValue = keyValuePair.split('=');
    let key = keyAndValue[0];
    let value = keyAndValue[1];
    
    if(keyAndValue.length === 2) {
      result[key] = value;
    }
  }

  return result;
}

function pruneFileExtension(filename) {
  
  // First, find the last '.'
  let dotLocation = -1;
  for (let i = filename.length-1; i >= 0; i--) {
    let curChar = filename[i];
    if(curChar === '.') {
      dotLocation = i;
      break;
    }
  }

  // No dot found, we leave the string as is
  if(dotLocation === -1) {
    return filename;
  }

  // If a dot was found, slice the dot and trailing characters
  return filename.slice(0, dotLocation);
}

/* Check if a node has a class */
function hasClass(node, className) {
  let classList = node.classList
  return classList.reduce((soFar, nextVal) => (soFar || nextVal === className), false);
}


/* 
 * An id must be an integer strictly greater than 0 
 * Handles both sting and number inputs.
 * Valid ids return true, invalid (the things parseInt turns into NaN) return false
 */
function isValidID(id) {
  let numberValue = Number(id)

  // Use number constructor, as parseInt silently truncates decimal numbers
  if(!Number.isInteger(numberValue)) {
    return false;
  }

  if(isNaN(numberValue) || numberValue < 1) {
    return false;
  }

  return true;
}
