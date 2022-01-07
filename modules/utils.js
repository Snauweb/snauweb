export { isValidID, hasClass }


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
  let intValue = parseInt(id);

  if(isNaN(intValue) || intValue < 1) {
    return false;
  }

  return true;
}
