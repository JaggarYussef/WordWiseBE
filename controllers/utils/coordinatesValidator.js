/**
 * Validates latitude and longitude coordinates.
 *
 * @param {string} latitude - The latitude coordinate to validate.
 * @param {string} longitude - The longitude coordinate to validate.
 * @returns {boolean} - True if the coordinates are valid, false otherwise.
 *
 * The valid range for latitude is from -90° to +90°.
 * The valid range for longitude is from -180° to +180°.
 */

const validateCoordinates = (latitude, longitude) => {
  const latRegex = /^-?([1-8]?[0-9]|[1-9]0)\.{1}\d{1,6}$/;
  const lonRegex = /^-?((1?[0-7]?[0-9])|([1]?[0-8]?[0-9]))\.{1}\d{1,6}$/;

  const isLatitudeValid = latRegex.test(latitude);
  const isLongitudeValid = lonRegex.test(longitude);

  return isLatitudeValid && isLongitudeValid;
};
export default validateCoordinates;
