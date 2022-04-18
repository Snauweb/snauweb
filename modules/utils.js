export {
  isValidID,
  hasClass,
  pruneFileExtension
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
