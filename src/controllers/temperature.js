import { poolQuery } from "../database.js";
import updateTemperatures from "./utils/temperatureUpdater.js";

/**
 * Retrieves all temperature records from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the temperature records are retrieved and sent as a response.
 */
export const getAlltemperatures = async (req, res) => {
  const queryString = `SELECT "slugname", to_char(date,'YYYY-MM-DD') AS date, "min_temperature", "max_temperature" FROM "temperatures" ORDER BY date `;

  // Execute and handle query;
  try {
    const queryResult = await poolQuery(queryString);
    console.log("queryResult", queryResult);

    // Checks if there are no temperature records in the database
    if (queryResult.rowCount === 0) {
      res.status(404).send("No available temperature records in the database");
      return;
    }

    // Sends the temperature records as a response
    res.status(200).send(queryResult.rows);
  } catch (error) {
    // Sends an error response if there's an error during the query execution
    res.status(500).send({ error: error.message });
  }
};

// Retrieves temperature records from the database based on the provided start date, end date, and slugname.
export const gettemperaturesWithDate = async (req, res, next) => {
  const { startDate, endDate, slugname } = req.body;
  console.log("req.body", req.body);

  // Handling user input validation
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

  // Encoding the slugname and formatting the dates
  const encodedSlugname = encodeURIComponent(slugname.trim().toLowerCase());
  const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
  const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);

  const queryString = `
   SELECT "slugname", to_char(date,'YYYY-MM-DD') AS date, "min_temperature", "max_temperature" FROM "temperatures"
   WHERE slugname = '${encodedSlugname}' AND
  "date" BETWEEN '${formattedStartDate}' AND '${formattedEndDate}' ORDER BY "date" `;

  // Execute the query and handle the results
  try {
    const queryResult = await poolQuery(queryString);
    console.log("queryResult", queryResult);

    if (queryResult.rowCount === 0) {
      res.status(404).send("No available temperature records in the database");
      return;
    }

    res.status(200).send(queryResult.rows);
  } catch (error) {
    // Handle errors
    res.status(500).send({ error: error.message });
  }
};

export const dummy = (req, res) => {
  updateTemperatures();
};
