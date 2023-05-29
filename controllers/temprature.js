import { poolQuery } from "../database/database.js";
// import updateTemperatures from "./utils/temperatureUpdater.js";

export const getAllTempratures = async (req, res, next) => {
  const queryString = `SELECT * FROM "tempratures"`;

  // Execute and handle SELECT all tempratures query;
  try {
    const queryResult = await poolQuery(queryString);
    console.log("queryResult", queryResult);
    if (queryResult.rowCount === 0) {
      res.status(404).send("No available temprature records in the database");
      return;
    }
    res.status(200).send(queryResult.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Retrieves all tempratures from the database for given slug with a given date range
export const getTempraturesWithDate = async (req, res, next) => {
  const { startDate, endDate, slugname } = req.body;
  console.log("req.body", req.body);
  // Handling user input
  if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
    res.status(400).send("startDate or endDate is not a valid date");
    return;
  }
  if (!startDate || !endDate || !slugname) {
    res.status(400).send("startDate or endDate or slugname is empty");
    return;
  }
  if (startDate > endDate) {
    res.status(400).send("startDate is greater than endDate");
    return;
  }

  const encodedSlugname = encodeURIComponent(slugname.trim());
  const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
  const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);

  const queryString = `SELECT "slugname", "creation_date", "min_temprature", "max_temprature" FROM "tempratures" WHERE slugname = '${encodedSlugname}' AND "creation_date" BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`;

  // Execute and handle SELECT  tempratures query;
  try {
    const queryResult = await poolQuery(queryString);
    console.log("queryResult", queryResult);
    if (queryResult.rowCount === 0) {
      res.status(404).send("No available temprature records in the database");
      return;
    }
    res.status(200).send(queryResult.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const dummy = () => {
  updateTemperatures();
};
