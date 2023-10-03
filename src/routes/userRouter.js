import { Router } from "express";
import fs from 'fs'
const routes = Router();

const path = '../users.json'

const readData = () => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
  };

routes.get("/", async (req, res) => {
  setTimeout(() => {
    let data  = readData()
    res.status(200).send({ message: data });
  }, 3000);
});
routes.post("/", async (req, res) => {
  setTimeout(() => {
    res.status(200).send({ message: "Hello!" });
  }, 3000);
});

export default routes;
