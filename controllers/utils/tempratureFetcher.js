import fetch from "node-fetch";

const currentDate = new Date().toISOString().slice(0, 10);

//TOOD : Move to env
const openCageKey = "19dc3323ba054891b255b5081f8cdd96";
const fetchTemprature = async (latitude, longitude, slugname = null) => {
  console.log("latitude", typeof latitude);
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
  console.log("min max", minTemp, maxTemp);
  // Fetching slugname for location
  // TODO:
  // 1. Last elemet in array of components is the name of the location
  // 2. Replace spaces with dashes
  // 3. Convert to lowercase
  // 4. Add numbers to make it unique. lat + long?
  const locationNameUrl = `https://api.opencagedata.com/geocode/v1/json?key=${openCageKey}&q=${latitude}+${longitude}&pretty=1&no_annotations=1`;
  const locationNameResponse = await fetch(locationNameUrl);
  const locationNameData = await locationNameResponse.json();
  const formattedAdress = locationNameData.results[0].formatted;
  const adressArray = formattedAdress.split(", ");
  if (slugname === null) {
    slugname = `region-${latitude}-${longitude}`;
  }
  // if (adressArray.length > 0) {
  //   slugname = adressArray[0].trim().replace("", "-");
  // } else {
  //   slugname = "region";
  // }
  // console.log("slugname", slugname);

  // console.log("locationNameData", locationNameData);
  return {
    maxTemp: maxTemp,
    minTemp: minTemp,
    slugname: slugname,
    date: currentDate,
  };
};

export default fetchTemprature;
