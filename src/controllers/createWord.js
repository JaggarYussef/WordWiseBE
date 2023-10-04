import { poolQuery } from "../database.js";

export const createWord = async (req, res) => {
  console.log(req.body);
  res.send("hello");

  const { word, phonetic, meaning } = req.body;

  const queryString = `INSERT INTO "words" (word, phonetic, meaning) VALUES ('${word}', '/${phonetic}', '${meaning}')`;
  try {
    console.log("this query", queryString);
    const queryResult = await poolQuery(queryString);

    console.log("insert query ", queryResult);
  } catch (error) {
    console.log(error);
  }
};
