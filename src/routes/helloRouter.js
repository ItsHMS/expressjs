import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  setTimeout(() => {
    res.status(200).send({ message: "Hello World!" });
  }, 3200);
});

export default routes;
