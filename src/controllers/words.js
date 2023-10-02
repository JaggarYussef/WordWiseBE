import { poolQuery } from "../database.js";

export const createWord = async (req, res) => {
  console.log(req.body);
  res.send("hello");
};
