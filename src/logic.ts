import { Request, Response } from "express";
import {
  IDeveloper,
  IDeveloperInfo,
  IDeveloperInfoRequest,
  IDeveloperRequest,
} from "./interfaces/interfaceDevelop";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";

export const createUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const data: IDeveloperRequest = request.body;

  const queryString = format(
    `
    INSERT INTO
          developers
          (%I)
    VALUES
          (%L)
    RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryResult: QueryResult<IDeveloper> = await client.query(queryString);
  console.log(queryResult.rows);
  return response.status(201).json(queryResult.rows[0]);
};

export const createUserDevInfo = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const data: IDeveloperInfoRequest = request.body;
  data.developerId = parseInt(request.params.id)
  const queryString = format(
    `
    INSERT INTO
    developer_infos(%I)

    VALUES
          (%L)
    RETURNING *
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryResult: QueryResult<IDeveloperInfo> = await client.query(
    queryString
  );

  console.log(queryResult.rows[0]);
  return response.status(201).json(queryResult.rows);
};

export const readUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  console.log("buscar o usuario");
  return response.status(200).json();
};

export const updateUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  console.log("update");
  return response.status(201).json();
};

export const deleteUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  console.log("Delete");
  return response.status(204);
};
