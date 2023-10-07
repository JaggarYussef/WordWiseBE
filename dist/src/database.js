var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pg from "pg";
/*
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255),
    phonetic VARCHAR(255),
    meaning VARCHAR(255)
);

 */
//TODO:
// - fix type checks on client.querry
const pool = new pg.Pool({
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: "postgres",
    password: "mysecretpassword",
    database: "postgres",
});
/**
 * Executes a query using the connection pool.
 *
 * @async
 * @param {string} poolQueryString - The query string to execute.
 * @returns {Promise<Object>} A promise that resolves to the query result.
 */
export const poolQuery = (poolQueryString) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    const result = yield pool.query(poolQueryString);
    const duration = Date.now() - start;
    console.log("executed poolQuery", {
        poolQueryString,
        duration,
        rows: result.rowCount,
    });
    return result;
});
/**
 * Retrieves a client from the connection pool and
 * adds additional functionality to track the last executed query and handle timeouts.
 *
 * Used for performing transactions.
 *
 * @returns {Promise<object>} A promise that resolves to the acquired client.
 */
export const getClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    const query = client.query;
    const release = client.release;
    // Set a timeout of 5 seconds, after which the client's last query will be logged
    const timeout = setTimeout(() => {
        console.error("A client has been checked out for more than 5 seconds!");
        // console.error(
        //   `The last executed query on this client was: ${client.lastQuery}`
        // );
    }, 5000);
    /**
     * @param {...*} args - The arguments passed to the query method.
     * @returns {*} The result of the original query method.
     */
    //@ts-ignore
    client.query = (...args) => {
        // client.lastQuery = args;
        //@ts-ignore
        return query.apply(client, args);
    };
    /**
     * Releases the client, clears the timeout, and restores the original query and release methods.
     * @returns {*} The result of the original release method.
     */
    client.release = () => {
        clearTimeout(timeout);
        client.query = query;
        client.release = release;
        return release.apply(client);
    };
    return client;
});
