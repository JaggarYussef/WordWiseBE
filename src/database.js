import pg from "pg";
/* 
LOCATION  TABLE SCRIPT 

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
    creation_date date NOT NULL,
    CONSTRAINT tempratures_pkey PRIMARY KEY (id),
    CONSTRAINT foreign_key FOREIGN KEY (slugname)
        REFERENCES public.location (slugname) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
 */
const pool = new pg.Pool({
  host: "seven-timer.cqqxczfso2zd.eu-north-1.rds.amazonaws.com",
  port: "5432",
  user: "postgres",
  password: "Z8z94!sBoJQC",
  database: "7timer",
});

export const poolQuery = async (poolQueryString) => {
  const start = Date.now();
  const result = await pool.query(poolQueryString);
  console.dir("results from database", result);
  const duration = Date.now() - start;
  console.log("excuted poolQuery", {
    poolQueryString,
    duration,
    rows: result.rowCount,
  });
  return result;
};
export const client = await pool.connect();