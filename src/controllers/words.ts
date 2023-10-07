import { poolQuery } from "../database.js";
import { MiddlwareParams } from "../types/Types.js";
import { Request, Response } from "express";

export const createWord = async (request: Request, response: Response) => {
  console.log("Request Body", request.body);

  const { word, phonetic, meaning } = request.body;

  const queryString = `INSERT INTO "words" (word, phonetic, meaning) VALUES ('${word}', '${phonetic}', '${meaning}')`;
  try {
    console.log("this query", queryString);
    const queryResult = await poolQuery(queryString);

    console.log("insert query ", queryResult);
    response.status(200);
  } catch (error: any) {
    console.log("Error inserting new row", error);
    response.status(500).send({ error: error.message });
  }
};

export const getWords = async (request: Request, response: Response) => {
  const queryString = `SELECT * FROM "words"`;

  try {
    const queryResult = await poolQuery(queryString);
    const readings = queryResult.rows;
    console.log("get all quer y", readings);
    response.send(readings);
  } catch (error: any) {
    console.log("Error retrieving rows", error);
    response.send({ error: error.message });
  }
};
