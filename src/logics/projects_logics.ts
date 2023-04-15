import { Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import { QueryConfig, QueryResult } from "pg";
import {
  IProjects,
  IProjectsDescription,
  IProjectsRequest,
  ITechnology,
  ITechnologyRequest,
} from "../interfaces/interfaceProject";

export const createProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const data: IProjectsRequest = request.body;

  const queryString = format(
    `
      INSERT INTO
             projects
             (%I)
      VALUES
             (%L)
      RETURNING *
    `,
    Object.keys(data),
    Object.values(data)
  );

  const queryResult: QueryResult<IProjects> = await client.query(queryString);
  if (queryResult.rows[0].endDate == undefined) {
    delete queryResult.rows[0].endDate;
  }
  return response.status(201).json(queryResult.rows[0]);
};
export const updateProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const data: IProjectsRequest = request.body;
  const id: number = Number(request.params.id);
  const queryString = format(
    `
    UPDATE
          projects
    SET (%I) = (%L)
    WHERE
        id = $1
    RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};
export const readProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = Number(request.params.id);
  const queryString = `
  SELECT
        pj."id" "projectId",
        pj."name" "projectName",
        pj."description" "projectDescription",
        pj."estimatedTime" "projectEstimatedTime",
        pj."repository" "projectRepository",
        pj."startDate" "projectStartDate",
        pj."endDate" "projectEndDate",
        pj."developerId" "projectDeveloperId",
        t."id" "technologyId",
        t."name" "technologyName"
  FROM
	      projects pj
  LEFT JOIN
	      projects_technologies pt ON pt."projectId" = pj."id"
  LEFT JOIN
	      technologies t ON pt."technologyId" = t."id"
  WHERE
	      pj."id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjectsDescription[]> = await client.query(
    queryConfig
  );

  return response.status(200).json(queryResult.rows);
};

export const addTechnologyToProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectId = Number(request.params.id);
  const name = request.body.name;
  const queryStringSelectTec = `
    SELECT 
          id 
    FROM 
          technologies 
    WHERE 
          name = $1`;

  const queryResultTechnology = await client.query(queryStringSelectTec, [
    name,
  ]);

  const technologyId: number = queryResultTechnology.rows[0].id;

  const queryStringInsertTecPj = `
    INSERT INTO
            projects_technologies
            ("addedIn", "projectId", "technologyId")
    VALUES
            (NOW(), $1, $2)`;

  const queryResultInsertTecPj = await client.query(queryStringInsertTecPj, [
    projectId,
    technologyId,
  ]);

  const queryStringProjects = `
    SELECT 
          * 
    FROM 
          projects 
    WHERE 
          id = $1`;
  const queryResultsProject = await client.query(queryStringProjects, [
    projectId,
  ]);

  const project = queryResultsProject.rows[0];

  return response.status(201).json({
    projectId: project.id,
    projectName: project.name,
    projectDescription: project.description,
    projectEstimatedTime: project.estimatedTime,
    projectRepository: project.repository,
    projectStartDate: project.startDate,
    projectEndDate: project.endDate,
    technologyId,
    technologyName: name,
  });
};
export const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = request.params.id;
  const queryString = `
  DELETE FROM
          projects
    WHERE 
          id = $1;

  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).json();
};

export const deleteTechnologiesProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const idProject: number = Number(request.params.id);
  const nameTechnology = request.params.name;

  const queryStringTechnology = `
      SELECT 
          *
      FROM
          technologies
      WHERE
          name = $1;
    `;
  const queryResultNameTechnology: QueryResult<ITechnology> = await client.query(
    queryStringTechnology,
    [nameTechnology]);
  
  const idTechnology = queryResultNameTechnology.rows[0].id;
  
  const queryStringProject_Tec = `
      DELETE FROM
          projects_technologies 
      WHERE
          "projectId" = $1 AND "technologyId" = $2;
          `;
  await client.query(queryStringProject_Tec,[idProject,idTechnology]);
  return response.status(204).json();
};