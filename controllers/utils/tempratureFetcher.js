import fetch from "node-fetch";
import { slugify } from "transliteration";
import coordinatesValidator from "./coordinatesValidator.js";
const currentDate = new Date().toISOString().slice(0, 10);

// TODO : throw error if latitude or longitude are not numbers or are not in the range
const fetchTemprature = async (latitude, longitude, slugname = true) => {
  if (!coordinatesValidator(latitude, longitude)) {
    console.log("fetchTemprature", latitude, longitude, slugname);

    throw new Error("Invalid coordinates");
  }
  // Fetching temprature
  // TODO:
  const temperatureUrl = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=astro&output=json`;
  const tempratureResponse = await fetch(temperatureUrl);
  const tempratureData = await tempratureResponse.json();
  // console.log("tempratureData", tempratureData);
  let minTemp = tempratureData.dataseries[0].temp2m;
  let maxTemp = tempratureData.dataseries[0].temp2m;
  tempratureData.dataseries.forEach((element) => {
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
      console.log("locationNameResponse", locationNameResponse);
      const locationNameData = await locationNameResponse.json();
      // grabs the smallest location property from the locationNameData object
      //prettier-ignore
      const addressArray = Object.values(locationNameData.address);
      console.log("addressArray", addressArray);
      const smallestLocationProperty = addressArray[1];
      console.log("smallestLocationProperty", smallestLocationProperty);
      slugname = slugify(smallestLocationProperty);
      console.log("slugnameProp", slugname);
      //prettier-ignore
      console.log("smallestLocationProperty", slugify(smallestLocationProperty));
    } catch (error) {
      console.log("error", error);
      slugname = `region-${latitude}-${longitude}`;
    }
  }

  return {
    maxTemp: maxTemp,
    minTemp: minTemp,
    slugname: slugname,
    date: currentDate,
  };
};

export default fetchTemprature;
