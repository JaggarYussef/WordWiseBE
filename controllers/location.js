import { poolQuery } from "../database/database.js";
import fetchTemprature from "./utils/tempratureFetcher.js";
import validateCoordinates from "./utils/coordinatesValidator.js";

const currentDate = new Date().toISOString().slice(0, 10);
// Takes longitude and latitude coordinates from the request body
// and assigns a slugname and creation date to the location.
export const createLocation = async (req, res, next) => {
  const { longitude, latitude } = req.body;

  if (!validateCoordinates(latitude, longitude)) {
    res.status(400).send("Invalid latitude or longitude coordinates");
    return;
  }
  if (!longitude === undefined || latitude === undefined) {
    res.status(400).send("Longitude or latitude is missing");
    return next();
  }
  //TODO: THROW ERROR IF LOCATION ALREADY EXISTS
  // throw error is longitute or latitude are not numbers
  //prettier-ignore
  const { minTemp, maxTemp, slugname } = await fetchTemprature(latitude, longitude, true);
  const queryString = `
  INSERT INTO "location" (slugname, longitude, latitude, creationdate) VALUES ('${slugname.trim()}', '${longitude}', '${latitude}', '${currentDate}') RETURNING *;
  INSERT INTO "tempratures" (slugname, min_temprature, max_temprature, creation_date) VALUES ('${slugname.trim()}', '${minTemp}', '${maxTemp}', '${currentDate}' ) RETURNING *;
  `;

  // Execute and handle the query
  try {
    const queryResult = await poolQuery(queryString);
    // console.log("queryResult", queryResult);
    const insertionQueryRows = queryResult[0].rows[0];
    const { id: resultId, slugname: resultSlugname } = insertionQueryRows;
    res.status(200).send(
      `
      Location with ID: ${resultId} has been added
      Use slugname ${resultSlugname} to retrieve the data related to the location
      `
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Retrieves a location from the database based on ID or the slugname
export const getLocation = async (req, res, next) => {
  const { id, slugname } = req.body;
  if (id === undefined && slugname === undefined) {
    res.status(400).send("ID and slugname are missing");
    return next();
  }
  let queryString = "";
  slugname === undefined
    ? (queryString = `SELECT * FROM "location" WHERE id = ${id.trim()}`)
    : (queryString = `SELECT * FROM "location" WHERE slugname = '${slugname.trim()}'`);

  // Execute and handle SELECT single location query;
  //TODO fix resultId and resultSlugname in the response
  try {
    const queryResult = await poolQuery(queryString);
    console.log("queryResult", queryResult);
    if (queryResult.rowCount === 0) {
      // No location found
      res.status(404).send("Location not found");
    } else {
      const {
        id: resultId,
        slugname: resultSlugname,
        latitude,
        longitude,
        creationdate,
      } = queryResult.rows[0];
      res.send({
        resultId,
        resultSlugname,
        latitude,
        longitude,
        creationDate: creationdate.toISOString().slice(0, 10),
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Deletes a location from the database based on ID or the slugname
export const deleteLocation = async (req, res, next) => {
  const { id, slugname } = req.body;
  if (id === undefined && slugname === undefined) {
    res.status(400).send("ID and slugname are missing");
    return next();
  }
  let locationQueryString = "";
  slugname === undefined
    ? (locationQueryString = `DELETE  FROM "location" WHERE id = ${id.trim()} RETURNING id, slugname;`)
    : (locationQueryString = `DELETE  FROM "location" WHERE slugname = '${slugname.trim()}' RETURNING id, slugname;`);
  //ignore prettier
  const tempratureQueryString = `DELETE  FROM "tempratures" WHERE slugname = '${slugname.trim()}' RETURNING id, slugname`;
  const queryString = `
   ${locationQueryString}
   ${tempratureQueryString}
   `;

  // Ecexute and handle DELETE query
  try {
    const queryResult = await poolQuery(queryString);
    if (queryResult.rowCount === 0) {
      // No location found
      res.status(404).send("Location does not exist");
    }
    const { id: resultId, slugname: resultSlugname } = queryResult.rows[0];
    res.status(200).send(`
    Location with ID: ${resultId} and slugname ${resultSlugname} has been deleted
    `);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Updates a location's slug based on ID
export const updateLocation = async (req, res, next) => {
  const { oldSlugname, newSlugname } = req.body;
  if (oldSlugname === undefined || newSlugname === undefined) {
    res.status(400).send("oldSlugname or newSlugname is missing");
    return;
  }
  if (oldSlugname === newSlugname) {
    res.status(400).send("oldSlugname and newSlugname are the same");
    return;
  }
  if (newSlugname === "" || oldSlugname === "") {
    res.status(400).send("oldSlugname or newSlugname is empty");
    return;
  }

  const encodedNewSlugname = encodeURIComponent(newSlugname.trim());
  const encodedOldSlugname = encodeURIComponent(oldSlugname.trim());
  const queryString = `
  UPDATE "location" SET slugname = '${encodedNewSlugname}' WHERE slugname = '${encodedOldSlugname}' RETURNING *;
  UPDATE "tempratures" SET slugname = '${encodedNewSlugname}' WHERE slugname = '${encodedOldSlugname}' RETURNING *;
  `;

  // Execute and handle UPDATE query
  try {
    const queryResult = await poolQuery(queryString);
    if (queryResult[0].rowCount === 0) {
      // No location found
      res.status(404).send("Location does not exist");
      return;
    }
    const queryResultRows = queryResult[0].rows[0];
    const {
      id,
      slugname,
      latitude,
      longitude,
      creationdate: creationDate,
    } = queryResultRows;
    res.status(200).send(`
    Location with slugname ${oldSlugname} has been updated
  { 
    id: ${id},
    slugname: ${slugname},
    latitude: ${latitude},
    longitude: ${longitude},
    creationDate: ${creationDate.toISOString().slice(0, 10)}
  }
    `);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Retrieves all locations from the database
export const getAllLocations = async (req, res, next) => {
  const queryString = `SELECT * FROM "location"`;

  // Execute and handle SELECT all locations query
  try {
    const queryResult = await poolQuery(queryString);
    const queryResultRows = queryResult.rows;
    if (queryResult.rowCount === 0) {
      res.status(404).send("No available locations in the database");
      return;
    }
    res.status(200).send(queryResultRows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
