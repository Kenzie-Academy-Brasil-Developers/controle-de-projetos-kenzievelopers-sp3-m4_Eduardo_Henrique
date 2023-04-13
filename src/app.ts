import express, { Application, json } from "express";
import "dotenv/config";
import {
  createUserDev,
  
  createUserDevInfo,
  
  deleteUserDev,
  readUserDev,
  updateUserDev,
} from "./logic";
import { ensureEmailExists, ensureUserInfoExists, ensureUserExists, validateOS } from "./middleware";

const app: Application = express();
app.use(json());
app.post("/developers", ensureEmailExists, createUserDev);
app.post("/developers/:id/infos", ensureUserExists, ensureUserInfoExists, validateOS, createUserDevInfo);
app.get("/developers/:id", ensureUserExists, readUserDev);
app.patch("/developers/:id", ensureUserExists, ensureEmailExists, updateUserDev);
app.delete("/developers/:id", deleteUserDev);

/*------------------ROTA /projects--------------------------*/
app.post("/projects" /* callback */);
app.get("/projects/:id" /* callback */);
app.patch("/projects/:id" /* callback */);
app.delete("/projects/:id" /* callback */);
app.post("/projects/:id/technologies" /* callback */);
app.post("/projects/:id/technologies/:name" /* callback */);

export default app;
