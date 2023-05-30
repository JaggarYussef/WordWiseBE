import { poolQuery } from "../database.js";
import fetchTemprature from "./utils/tempratureFetcher.js";
import validateCoordinates from "./utils/coordinatesValidator.js";

const currentDate = new Date().toISOString().slice(0, 10);

/**
 * Creates a new location and its associated temperature records.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the location is created.
 */
export const createLocation = async (req, res) => {
  const { longitude, latitude } = req.body;

  if (!validateCoordinates(latitude, longitude)) {
    res.status(400).send("Invalid latitude or longitude coordinates");
    return;
  }

  if (longitude === undefined || latitude === undefined) {
    res.status(400).send("Longitude or latitude is missing");
    return;
  }

  // Fetches temperature data for the location
  const { minTemp, maxTemp, slugname } = await fetchTemprature(
    latitude,
    longitude,
    true
  );

  const queryString = `
    INSERT INTO "location" (slugname, longitude, latitude, creationdate) VALUES ('${slugname.trim()}', '${longitude}', '${latitude}', '${currentDate}') RETURNING *;
  `;

  try {
    // Executes the queries and handles the results
    const queryResult = await poolQuery(queryString);
    const insertionQueryRows = queryResult.rows[0];
    console.log("insertionQueryRows", insertionQueryRows);
    const { id: resultId, slugname: resultSlugname } = insertionQueryRows;

    res.status(200).send(
      `
      Location with ID: ${resultId} has been added.
      Use slugname ${resultSlugname} to retrieve the data related to the location.
      `
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
//Retrieves the location information based on the ID or slugname
export const getLocation = async (req, res) => {
  const { id, slugname } = req.body;

  // Check if both ID and slugname are missing
  if (id === undefined && slugname === undefined) {
    res.status(400).send("ID and slugname are missing");
    return;
  }

  let queryString = "";

  slugname === undefined
    ? (queryString = `SELECT * FROM "location" WHERE id = ${id.trim()}`)
    : (queryString = `SELECT * FROM "location" WHERE slugname = '${slugname.trim()}'`);

  try {
    // Execute the SELECT query to retrieve the location information
    const queryResult = await poolQuery(queryString);
    console.log("queryResult", queryResult);

    if (queryResult.rowCount === 0) {
      // No location found
      res.status(404).send("Location not found");
      return;
    } else {
      // Extract the relevant location data from the query result
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

// Delete location by slugname or id
export const deleteLocation = async (req, res) => {
  const { id, slugname } = req.body;

  if (id === undefined && slugname === undefined) {
    res.status(400).send("ID and slugname are missing");
    return;
  }

  let locationQueryString = "";

  if (slugname === undefined) {
    locationQueryString = `DELETE  FROM "location" WHERE id = ${id.trim()} RETURNING id, slugname;`;
  } else {
    locationQueryString = `DELETE  FROM "location" WHERE slugname = '${slugname.trim()}' RETURNING id, slugname;`;
  }

  try {
    // Execute DELETE queries
    const queryResult = await poolQuery(locationQueryString);
    console.log("queryResult", queryResult);
    if (queryResult.rowCount === 0) {
      // No location found
      res.status(404).send("Location does not exist");
      return;
    }
    // Extract the relevant location data from the query result
    const { id: resultId, slugname: resultSlugname } = queryResult.rows[0];

    res.status(200).send(`
    Location with ID: ${resultId} and slugname ${resultSlugname} has been deleted
    `);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: error.message });
  }
};

// Update location by slugname or id
export const updateLocation = async (req, res) => {
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

    // Extract the relevant location data from the query result
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
export const getAllLocations = async (req, res) => {
  const queryString = `SELECT * FROM "location"`;

  // Execute and handle SELECT all locations query
  try {
    const queryResult = await poolQuery(queryString);
    const queryResultRows = queryResult.rows;

    // If no locations are found, return a 404 response
    if (queryResult.rowCount === 0) {
      res.status(404).send("No available locations in the database");
      return;
    }

    // Send a 200 response with the retrieved locations
    res.status(200).send(queryResultRows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
