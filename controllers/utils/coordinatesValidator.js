const validateCoordinates = (latitude, longitude) => {
  const latRegex = /^-?([1-8]?[0-9]|[1-9]0)\.{1}\d{1,6}$/;
  const lonRegex = /^-?((1?[0-7]?[0-9])|([1]?[0-8]?[0-9]))\.{1}\d{1,6}$/;

  const isLatitudeValid = latRegex.test(latitude);
  const isLongitudeValid = lonRegex.test(longitude);

  return isLatitudeValid && isLongitudeValid;
};
export default validateCoordinates;
