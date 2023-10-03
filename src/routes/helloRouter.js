import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  setTimeout(() => {
    res.status(200).send({ message: "Hello!" });
  }, 3000);
});
routes.post("/", async (req, res) => {
  setTimeout(() => {
    res.status(200).send({ message: "Hello!" });
  }, 3000);
});

export default routes;
