var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { poolQuery } from "../database.js";
export const createWord = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request Body", request.body);
    const { word, phonetic, meaning } = request.body;
    const queryString = `INSERT INTO "words" (word, phonetic, meaning) VALUES ('${word}', '${phonetic}', '${meaning}')`;
    try {
        console.log("this query", queryString);
        const queryResult = yield poolQuery(queryString);
        console.log("insert query ", queryResult);
        response.status(200);
    }
    catch (error) {
        console.log("Error inserting new row", error);
        response.status(500).send({ error: error.message });
    }
});
export const getWords = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = `SELECT * FROM "words"`;
    try {
        const queryResult = yield poolQuery(queryString);
        const readings = queryResult.rows;
        console.log("get all quer y", readings);
        response.send(readings);
    }
    catch (error) {
        console.log("Error retrieving rows", error);
        response.send({ error: error.message });
    }
});
