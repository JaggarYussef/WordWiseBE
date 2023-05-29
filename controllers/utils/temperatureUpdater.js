import { client } from "../../database/database.js";
import fetchTemprature from "./tempratureFetcher.js";

const updateTemperatures = async () => {
  try {
    await client.query("BEGIN");
    const selectLocationsQuery = `SELECT "slugname", "latitude", "longitude" FROM "location" `;
    const queryResult = await client.query(selectLocationsQuery);
    console.log("queryResult", queryResult);

    // Get existing locations from location table and fetch the min- max-temperatures for the day
    const temperatureRecords = await Promise.all(
      queryResult.rows.map(async (location) => {
        const { slugname, latitude, longitude } = location;
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
