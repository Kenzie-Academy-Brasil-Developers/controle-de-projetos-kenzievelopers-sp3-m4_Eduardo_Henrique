import { Request, Response } from "express";
import {
  IDeveloper,
  IDeveloperAllInfos,
  IDeveloperInfo,
  IDeveloperInfoRequest,
  IDeveloperRequest,
} from "../interfaces/interfaceDevelop";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

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
  return response.status(201).json(queryResult.rows[0]);
};

export const createUserDevInfo = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const data: IDeveloperInfoRequest = request.body;
  data.developerId = parseInt(request.params.id);
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

  return response.status(201).json(queryResult.rows[0]);
};

export const readUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id = request.params.id;
  const queryString = `
      SELECT 
            dev.id "developerId",
            dev.name "developerName",
            dev.email "developerEmail",
            dev_i."developerSince" "developerInfoDeveloperSince",
            dev_i."preferredOS" "developerInfoPreferredOS"
      FROM
            developers dev
      LEFT JOIN
            developer_infos dev_i ON dev_i."developerId" = dev.id
      WHERE 
            dev.id = $1;`;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IDeveloperAllInfos> = await client.query(
    queryConfig
  );
  return response.status(200).json(queryResult.rows);
};

export const updateUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const data: IDeveloperRequest = request.body;
  const queryString = format(
    `
      UPDATE
          developers
      SET
          (%I) = (%L)
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

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

export const deleteUserDev = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = Number(request.params.id);

  console.log("ID:", id);

  const queryString: string = `
    DELETE FROM
          developers
    WHERE 
          id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};