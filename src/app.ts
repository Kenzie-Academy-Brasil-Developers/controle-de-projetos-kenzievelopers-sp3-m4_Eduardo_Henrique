import express, { Application, json } from "express";
import "dotenv/config";

const app: Application = express();
app.use(json())
app.post('/developers',/* callback */)
app.post('/developers/:id/infos',/* callback */)
app.get('/developers/:id',/* callback */)
app.patch('/developers/:id',/* callback */)
app.delete('/developers/:id',/* callback */)
/*------------------ROTA /projects--------------------------*/
app.post('/projects',/* callback */)
app.get('/projects/:id',/* callback */)
app.patch('/projects/:id',/* callback */)
app.delete('/projects/:id',/* callback */)
app.post('/projects/:id/technologies',/* callback */)
app.post('/projects/:id/technologies/:name',/* callback */)


export default app;
