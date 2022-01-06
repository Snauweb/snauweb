export { isValidID }

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
