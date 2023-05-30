import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
/* 
* LOCATION  TABLE SCRIPT 
*
(
    id integer NOT NULL,
    slugname character varying(255) NOT NULL,
    latitude real,
    longitude real,
    creationdate date,
    CONSTRAINT location_pkey PRIMARY KEY (id),
    CONSTRAINT unique_slug UNIQUE (slugname)
)

*/

/*
 * TEMPERATURE TABLE SCRIPT
(
    id integer NOT NULL,
    slugname character varying(255) NOT NULL,
    min_temprature integer NOT NULL,
    max_temprature integer NOT NULL,
    date date NOT NULL,
    CONSTRAINT tempratures_pkey PRIMARY KEY (id),
    CONSTRAINT foreign_key FOREIGN KEY (slugname)
        REFERENCES public.location (slugname) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
 */
const pool = new pg.Pool({
  host: process.env.DATABASE_HOST,
  port: "5432",
  user: "postgres",
  password: process.env.DATABASE_PASSWORD,
  database: "7timer",
});

/**
 * Executes a query using the connection pool.
 *
 * @async
 * @param {string} poolQueryString - The query string to execute.
 * @returns {Promise<Object>} A promise that resolves to the query result.
 */
export const poolQuery = async (poolQueryString) => {
  const start = Date.now();
  const result = await pool.query(poolQueryString);
  const duration = Date.now() - start;
  console.log("executed poolQuery", {
    poolQueryString,
    duration,
    rows: result.rowCount,
  });
  return result;
};

/**
 * Retrieves a client from the connection pool and
 * adds additional functionality to track the last executed query and handle timeouts.
 *
 * Used for performing transactions.
 *
 * @returns {Promise<object>} A promise that resolves to the acquired client.
 */
export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Set a timeout of 5 seconds, after which the client's last query will be logged
  const timeout = setTimeout(() => {
    console.error("A client has been checked out for more than 5 seconds!");
    console.error(
      `The last executed query on this client was: ${client.lastQuery}`
    );
  }, 5000);

  /**
   * Monkey patches the client's query method to keep track of the last executed query.
   * @param {...*} args - The arguments passed to the query method.
   * @returns {*} The result of the original query method.
   */
  client.query = (...args) => {
    client.lastQuery = args;
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
};
