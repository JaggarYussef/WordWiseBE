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
  const isLatitudeValid = latitude >= -90 && latitude <= 90;
  const isLongitudeValid = longitude >= -180 && longitude <= 180;

  return isLatitudeValid && isLongitudeValid;
};
export default validateCoordinates;
