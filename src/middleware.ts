import {
  NextFunction,
  Request,
  Response,
  query,
  request,
  response,
} from "express";
import { IDeveloper, IDeveloperInfo } from "./interfaces/interfaceDevelop";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import {
  IProjects,
  ITechnoProject,
  ITechnology,
  ITechnologyRequest,
} from "./interfaces/interfaceProject";

export const ensureEmailExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = request.body.email;
  const queryString: string = `
      SELECT 
          * 
      FROM 
          developers
      WHERE 
          email = $1;
      `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);
  if (queryResult.rows.length > 0) {
    return response.status(409).json({
      message: "Email already exists",
    });
  }

  return next();
};

export const ensureUserExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
        SELECT 
            * 
        FROM 
            developers
        WHERE 
            id = $1;
        `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);
  if (queryResult.rows.length == 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  }

  return next();
};

export const ensureUserInfoExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const queryString = `
      SELECT 
          * 
      FROM 
          developer_infos
      WHERE 
          developer_infos."developerId" = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloperInfo> = await client.query(
    queryConfig
  );

  if (queryResult.rows.length > 0) {
    return response.status(409).json({
      message: "There's already a profile information for this user.",
    });
  }

  return next();
};

export const validateOS = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const OS: string = request.body.preferredOS;
  if (OS !== "Windows" && OS !== "Linux" && OS !== "MacOS") {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }
  return next();
};

export const ensureDeveloperIdProject = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const dataId: number = request.body.developerId;

  const queryString = `
  SELECT
      * 
  FROM 
      developers 
  WHERE 
      id = $1;`;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [dataId],
  };
  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);
  if (queryResult.rows.length === 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  }
  return next();
};

export const ensureProjectExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString = `
        SELECT 
            * 
        FROM 
            projects
        WHERE 
            id = $1;
        `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  if (queryResult.rows.length == 0) {
    return response.status(404).json({
      message: "Project not found.",
    });
  }
  return next();
};

export const ensureNameTecExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const nameTechnology: ITechnologyRequest = request.body.name;
  const idProject: number = Number(request.params.id);
  const routePath = request.route.path;

  const queryStringNameTec: string = `
    SELECT
        * 
    FROM
        technologies
    WHERE
        name = $1;
  `;

  let queryConfig: QueryConfig = {
    text: queryStringNameTec,
    values: [nameTechnology],
  };

  if (routePath === "/projects/:id/technologies/:name") {
    const nameTechnologyParams: string = request.params.name;

    queryConfig = {
      text: queryStringNameTec,
      values: [nameTechnologyParams],
    };
  }

  const queryResult: QueryResult<ITechnology> = await client.query(queryConfig);

  const queryStringTechnoProject: string = `
      SELECT 
          * 
      FROM 
          projects_technologies 
      WHERE 
          "projectId" = $1;
  `;

  const queryResultTechnoProject: QueryResult<ITechnoProject> =
    await client.query(queryStringTechnoProject, [idProject]);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
  const queryStringFoundTechnoName = `
  SELECT 
      * 
  FROM 
      projects_technologies 
  WHERE 
      "technologyId" =$1 ; 
  `;
  const queryConfigFoundTechnoName: QueryConfig = {
    text: queryStringFoundTechnoName,
    values: [queryResult.rows[0].id],
  };
  const queryResultFoundTechnoName = await client.query(
    queryConfigFoundTechnoName
  );

  if (queryResultFoundTechnoName.rows.length !== 0) {
    return response.status(404).json({
      message: "The technology already exists",
    });
  }

  return next();
};

export const ensureTecInProject = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const idProject: number = Number(request.params.id);
  const nameTechnology: string = request.params.name;

  const queryStringNameTec = `
      SELECT
          *
      FROM
          technologies
      WHERE
          name = $1;
      `;

  const queryResultNameTec: QueryResult<ITechnology> = await client.query(
    queryStringNameTec,
    [nameTechnology]
  );

  const idTec = queryResultNameTec.rows[0].id;

  const queryStringProject = `
      SELECT 
          * 
      FROM 
          projects_technologies 
      WHERE 
          "projectId" = $1;
  `;

  const queryResultProjectTec: QueryResult<ITechnoProject> = await client.query(
    queryStringProject,
    [idProject]
  );

  if (queryResultProjectTec.rows.length == 0) {
    return response.status(400).json({
      message: "Technology not found",
    });
  }

  return next();
};
