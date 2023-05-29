// import client from "../../database/database.js";
// import fetchTemprature from "./tempratureFetcher.js";

// const updateTemperatures = async () => {
//   client
//     .connect()
//     .then(() => console.log("connected "))
//     .catch((err) => {
//       console.log(console.error());
//     });

//   const selectQuery = `SELECT "slugname", "latitude", "longitude" FROM "location" `;
//   //   console.log("queyr", await client.query(selectQuery));
//   const locationArray = (await client.query(selectQuery)).rows;

//   // Get existing locations from location table and fetch the min- max-temperatures for the day
//   const coordinates = await Promise.all(
//     locationArray.map(async (location) => {
//       const { slugname, latitude, longitude } = location;
//       const { minTemp, maxTemp, date } = await fetchTemprature(
//         latitude,
//         longitude,
//         slugname
//       );
//       const tempratureUpdateQuery = `
//         INSERT INTO "tempratures"("slugname", "min_temprature", "max_temprature","creation_date")
//         VALUES('${slugname}', ${minTemp}, ${maxTemp}, '${date}')
//         `;
//       return tempratureUpdateQuery;
//     })
//   );
//   client
//     .query(coordinates.join(";"))
//     .then((result) =>
//       console.log(`${result.length} rows have been added to temperatures table`)
//     )
//     .catch((err) =>
//       console.log("Error updating temperature records ", err.message)
//     );
// };
// export default updateTemperatures;
