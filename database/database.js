import pg from "pg";
/* 
LOCATION  TABLE SCRIPT 

CREATE TABLE IF NOT EXISTS public.location
(
    id integer NOT NULL DEFAULT nextval('location_id_seq'::regclass),
    slugname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    latitude real,
    longitude real,
    creationdate date,
    CONSTRAINT location_pkey PRIMARY KEY (id),
    CONSTRAINT unique_slug UNIQUE (slugname)
)

*/

/*
 * TEMPERATURE DB SCRIPT
 CREATE TABLE IF NOT EXISTS public.tempratures
(
    id integer NOT NULL DEFAULT nextval('tempratures_id_seq'::regclass),
    slugname character varying(255) COLLATE pg_catalog."default" NOT NULL,
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
  host: "0.0.0.0",
  port: "5432",
  user: "postgres",
  password: "docker",
  database: "7timer",
});

export const poolQuery = async (poolQueryString) => {
  const start = Date.now();
  const result = await pool.query(poolQueryString);
  console.dir("results from database", result);
  const duration = Date.now() - start;
  //TODO ADD PARAM TO MAKE MESSAGE SPECIFIC FOR EACH poolQuery
  console.log("excuted poolQuery", {
    poolQueryString,
    duration,
    rows: result.rowCount,
  });
  return result;
};
