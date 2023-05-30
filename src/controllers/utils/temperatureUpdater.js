import { client } from "../../database.js";
import fetchTemprature from "./tempratureFetcher.js";

/**
 * Updates temperature records for locations stored in the database.
 * @returns {Promise<void>} - A promise that resolves when the temperature records are updated.
 */
const updateTemperatures = async () => {
  try {
    await client.query("BEGIN");

    // Retrieves locations from the "location" table
    const selectLocationsQuery = `SELECT "slugname", "latitude", "longitude" FROM "location" `;
    const queryResult = await client.query(selectLocationsQuery);
    console.log("queryResult", queryResult);

    // Fetches and updates temperature records for each location
    const temperatureRecords = await Promise.all(
      queryResult.rows.map(async (location) => {
        const { slugname, latitude, longitude } = location;

        // Fetches temperature data for the location
        const { minTemp, maxTemp, date } = await fetchTemprature(
          latitude,
          longitude,
          slugname
        );

        const tempratureUpdateQuery = `
          INSERT INTO "tempratures"("slugname", "min_temprature", "max_temprature","creation_date")
          VALUES('${slugname}', ${minTemp}, ${maxTemp}, '${date}')
        `;

        return tempratureUpdateQuery;
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
  }
};
export default updateTemperatures;
