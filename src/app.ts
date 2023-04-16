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
  ensureNameTecExists,
  ensureTecInProject,
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

app.post("/projects", ensureDeveloperIdProject, createProject);
app.get("/projects/:id", ensureProjectExists, readProject);
app.patch("/projects/:id", ensureDeveloperIdProject, ensureProjectExists, updateProject);
app.delete("/projects/:id", ensureProjectExists,deleteProject);
app.post("/projects/:id/technologies", ensureProjectExists, ensureNameTecExists, addTechnologyToProject);
app.delete("/projects/:id/technologies/:name", ensureProjectExists, ensureNameTecExists, ensureTecInProject,deleteTechnologiesProject);

export default app;
