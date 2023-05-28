import { poolQuery } from "../database/database.js";
import fetchTemprature from "./utils/tempratureFetcher.js";

const currentDate = new Date().toISOString().slice(0, 10);
// Takes longitude and latitude coordinates from the request body
// and assigns a slugname and creation date to the location.
export const createLocation = async (req, res, next) => {
  const { longitude, latitude } = req.body;
  console.log("rea", req.body);
  //prettier-ignore
  const { minTemp, maxTemp, slugname } = await fetchTemprature(latitude, longitude, null);
  console.log("slugnae", slugname);
  const creation_date = currentDate;
  const queryString = `
  INSERT INTO "location" (slugname, longitude, latitude, creationdate) VALUES ('${slugname.trim()}', '${longitude}', '${latitude}', '${currentDate}') RETURNING *;
  INSERT INTO "tempratures" (slugname, min_temprature, max_temprature, creation_date) VALUES ('${slugname.trim()}', '${minTemp}', '${maxTemp}', '${currentDate}' ) RETURNING *;
  `;

  // Execute the query

  const queryResult = await poolQuery(queryString);
  const insertionQueryRows = queryResult[0].rows[0];
  const { id: resultId, slugname: resultSlugname } = insertionQueryRows;
  res.status(200).send(`
  Location with ID: ${resultId} has been added
  Use slugname ${resultSlugname} to retrieve the data related to the location
  `);
};

// Retrieves a location from the database based on ID or the slugname
// TODO: HANDLE EMPTY REQUEST PARAMS
export const getLocation = async (req, res, next) => {
  console.log("req body", req.body);
  const { id, slugname } = req.body;
  let queryString = "";
  slugname === undefined
    ? (queryString = `SELECT * FROM "location" WHERE id = ${id.trim()}`)
    : (queryString = `SELECT * FROM "location" WHERE slugname = '${slugname.trim()}'`);

  // Execute and handle SELECT single location query;
  const queryResult = await poolQuery(queryString);
  console.log("queryResult", queryResult.rows[0]);
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
};

// Deletes a location from the database based on ID or the slugname
export const deleteLocation = async (req, res, next) => {
  const { id, slugname } = req.body;
  console.log("delete slugname", slugname);
  let queryString = "";
  slugname === undefined
    ? (queryString = `DELETE  FROM "location" WHERE id = ${id.trim()} RETURNING id, slugname`)
    : (queryString = `DELETE  FROM "location" WHERE slugname = '${slugname.trim()}' RETURNING id, slugname`);

  // Ecexute and handle DELETE query
  const queryResult = await poolQuery(queryString);
  console.log("queryResult", queryResult);
  const { id: resultId, slugname: resultSlugname } = queryResult.rows[0];
  res.status(200).send(`
  Location with ID: ${resultId} and slugname ${resultSlugname} has been deleted
  `);
};

// what should update do? update
// update location coordinates? then everything related must be deleted from temperature table => means creating a new location
// OR
// Update to location with a new custom slugname => it must take a name that its url safe and updates the related fiels in temp table
// Updates a location's slug based on ID

//TODO
// ADD FUCNTION TO MAKE STRING URL SAFE
export const updateLocation = async (req, res, next) => {
  const { oldSlugname, newSlugname } = req.body;
  console.log("update req body", req.body);
  const queryString = `UPDATE "location" SET slugname = '${newSlugname.trim()}' WHERE slugname = '${oldSlugname}' RETURNING *`;

  // Execute and handle UPDATE query
  const queryResult = await poolQuery(queryString);
  const queryResultRows = queryResult.rows[0];
  const {
    id,
    slugname,
    latitude,
    longitude,
    creationdate: creationDate,
  } = queryResultRows;
  console.log("update query result", queryResult);
  res.status(200).send(`
  Location with slugname ${oldSlugname} has been updated
  ${id},
  ${slugname},
  ${latitude},
  ${longitude},
  ${creationDate.toISOString().slice(0, 10)}
  `);
};

// Retrieves all locations from the database
export const getAllLocations = async (req, res, next) => {
  const queryString = `SELECT * FROM "location"`;

  // Execute and handle SELECT all locations query
  const queryResult = await poolQuery(queryString);
  console.log("getall query resutl", queryResult);
  const queryResultRows = queryResult.rows;
  res.status(200).send(queryResultRows);
};
