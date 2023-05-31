import { poolQuery } from "../database.js";

/**
 * Retrieves all temperature records from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the temperature records are retrieved and sent as a response.
 */
export const getAllTempratures = async (req, res) => {
  const queryString = `SELECT "slugname", to_char(date,'YYYY-MM-DD') AS date, "min_temprature", "max_temprature" FROM "tempratures" ORDER BY date `;

  // Execute and handle SELECT all temperatures query;
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
export const getTempraturesWithDate = async (req, res, next) => {
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
  const encodedSlugname = encodeURIComponent(slugname.trim());
  const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
  const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);

  const queryString = `
   SELECT "slugname", to_char(date,'YYYY-MM-DD') AS date, "min_temprature", "max_temprature" FROM "tempratures"
   WHERE slugname = '${encodedSlugname}' AND
  "date" BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`;

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
