import fetch from "node-fetch";
import { slugify } from "transliteration";
import coordinatesValidator from "./coordinatesValidator.js";
const currentDate = new Date().toISOString().slice(0, 10);

/**
 * Fetches temperature data based on latitude and longitude coordinates.
 * @async
 * @param {number} latitude - The latitude coordinate.
 * @param {number} longitude - The longitude coordinate.
 * @param {boolean} [slugname=true] - Optional flag indicating whether to fetch the slugname for the location.
 * @throws {Error} Throws an error if the coordinates are invalid.
 * @returns {Promise<object>} The temperature data object.
 * @property {number} maxTemp - The maximum temperature.
 * @property {number} minTemp - The minimum temperature.
 * @property {string} slugname - The slugname of the location.
 * @property {string} date - The current date.
 */
const fetchTemperature = async (latitude, longitude, slugname = true) => {
  // Check if the coordinates are valid
  if (!coordinatesValidator(latitude, longitude)) {
    throw new Error("Invalid coordinates");
  }

  // Fetching temperature
  const temperatureUrl = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=astro&output=json`;
  const temperatureResponse = await fetch(temperatureUrl);
  const temperatureData = await temperatureResponse.json();

  let minTemp = temperatureData.dataseries[0].temp2m;
  let maxTemp = temperatureData.dataseries[0].temp2m;

  temperatureData.dataseries.forEach((element) => {
    if (element.temp2m > maxTemp) {
      maxTemp = element.temp2m;
    }
    if (element.temp2m < minTemp) {
      minTemp = element.temp2m;
    }
  });

  // Fetching slugname for location
  if (slugname === true) {
    try {
      const locationNameUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const locationNameResponse = await fetch(locationNameUrl);
      const locationNameData = await locationNameResponse.json();
      const shortenedLatitude = Number(parseFloat(latitude).toFixed(2));
      const shortenedLongitude = Number(parseFloat(longitude).toFixed(2));

      //grab the first/closest settlement property that exists
      const locationProperties = new Map(
        Object.entries(locationNameData.address)
      );
      const settlementHierarchy = [
        "neighbourhood",
        "village",
        "suburb",
        "locality",
        "town",
        "municipality",
        "district",
        "county",
        "city",
        "state",
        "region",
      ];

      for (const settlement of settlementHierarchy) {
        if (locationProperties.has(settlement)) {
          slugname = slugify(locationProperties.get(settlement.trim()));
          break;
        }
      }

      if (slugname === true) {
        console.log(
          `No settlement property found for ${shortenedLatitude}, ${shortenedLongitude}`
        );
        // Assigns default slugname if fetching fails
        slugname = `region-${shortenedLatitude}-${shortenedLongitude}`;
      }
    } catch (error) {
      console.log("error", error);
      // Assigns default slugname if fetching fails
      slugname = `region-${shortenedLatitude}-${shortenedLongitude}`;
    }
  }

  return {
    maxTemp: maxTemp,
    minTemp: minTemp,
    slugname: slugname,
    date: currentDate,
  };
};

export default fetchTemperature;
