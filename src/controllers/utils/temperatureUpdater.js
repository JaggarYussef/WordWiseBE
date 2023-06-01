import { getClient } from "../../database.js";
import fetchTemperature from "./temperatureFetcher.js";

/**
 * Updates temperature records for locations stored in the database.
 * @returns {Promise<void>} - A promise that resolves when the temperature records are updated.
 */
const updateTemperatures = async () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Retrieves locations from the "location" table
    const selectLocationsQuery = `SELECT "slugname", "latitude", "longitude" FROM "location" WHERE creationdate !=  '${currentDate}' `;
    const queryResult = await client.query(selectLocationsQuery);
    console.log("queryResult", queryResult);

    // Fetches and updates temperature records for each location
    const temperatureRecords = await Promise.all(
      queryResult.rows.map(async (location) => {
        const { slugname, latitude, longitude } = location;

        // Fetches temperature data for the location
        const { minTemp, maxTemp, date } = await fetchTemperature(
          latitude,
          longitude,
          slugname
        );

        const temperatureUpdateQuery = `
          INSERT INTO "temperatures"("slugname", "min_temperature", "max_temperature","date")
          VALUES('${slugname}', ${minTemp}, ${maxTemp}, '${date}')
        `;

        return temperatureUpdateQuery;
      })
    );

    // Executes the temperature update queries as a single transaction
    const transactionResult = await client.query(temperatureRecords.join(";"));
    console.log(
      `${transactionResult.length}  Temperature records updated for the day`
    );

    await client.query("COMMIT");
  } catch (error) {
    console.log("error", error);

    await client.query("ROLLBACK");
  } finally {
    client.release();
    return;
  }
};
export default updateTemperatures;
