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

import { addTechnologyToProject, createProject, deleteProject, deleteTechnologiesProject, readProject, updateProject } from "./logics/projects_logics";

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
app.get("/projects/:id", ensureProjectExists, readProject);
app.patch("/projects/:id", ensureDeveloperIdProject, ensureProjectExists, updateProject);
app.delete("/projects/:id", );
app.post("/projects/:id/technologies",  ensureProjectExists, addTechnologyToProject);
app.delete("/projects/:id/technologies/:name", );

export default app;
