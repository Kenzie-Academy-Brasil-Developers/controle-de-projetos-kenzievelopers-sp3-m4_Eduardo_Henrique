import express, { Application, json } from "express";
import "dotenv/config";
import {
  createUserDev,
  createUserDevInfo,
  deleteUserDev,
  readUserDev,
  updateUserDev,
} from "./logics/developers_logics";
import {
  ensureEmailExists,
  ensureUserInfoExists,
  ensureUserExists,
  validateOS,
  ensureDeveloperIdProject,
  ensureProjectExists,
} from "./middleware";

import { createProject, updateProject } from "./logics/projects_logics";

const app: Application = express();
app.use(json());
app.post("/developers", ensureEmailExists, createUserDev);
app.post(
  "/developers/:id/infos",
  ensureUserExists,
  ensureUserInfoExists,
  validateOS,
  createUserDevInfo
);
app.get("/developers/:id", ensureUserExists, readUserDev);
app.patch(
  "/developers/:id",
  ensureUserExists,
  ensureEmailExists,
  updateUserDev
);
app.delete("/developers/:id", ensureUserExists, deleteUserDev);

/*------------------ROTA /projects--------------------------*/
app.post("/projects", ensureDeveloperIdProject, createProject);
app.get("/projects/:id" ,/* callback */);
app.patch("/projects/:id", ensureDeveloperIdProject, ensureProjectExists, updateProject);
app.delete("/projects/:id" /* callback */);
app.post("/projects/:id/technologies" /* callback */);
app.post("/projects/:id/technologies/:name" /* callback */);

export default app;
