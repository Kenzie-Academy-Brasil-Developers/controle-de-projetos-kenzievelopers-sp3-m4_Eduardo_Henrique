CREATE TABLE IF NOT EXISTS developers (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50) UNIQUE NOT NULL);
 
CREATE TYPE "OS" AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS developer_infos (
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "preferredOS" "OS" NOT NULL,
    "developerId" INTEGER UNIQUE NOT NULL,
    FOREIGN KEY("developerId") REFERENCES developers("id")
);

CREATE TABLE IF NOT EXISTS projects (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INTEGER NOT NULL,
    FOREIGN KEY("developerId") REFERENCES developers("id")
)

CREATE TABLE IF NOT EXISTS technologies(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);

INSERT INTO technologies (name)
VALUES ('JavaScript');

INSERT INTO technologies (name)
VALUES ('Python');

INSERT INTO technologies (name)
VALUES ('React');

INSERT INTO technologies (name)
VALUES ('Express.js');

INSERT INTO technologies (name) 
VALUES ('HTML');

INSERT INTO technologies (name)
VALUES ('CSS');

INSERT INTO technologies (name)
VALUES ('Django');

INSERT INTO technologies (name) 
VALUES ('PostgreSQL');

INSERT INTO technologies (name)
VALUES ('MongoDB');

CREATE TABLE IF NOT EXISTS projects_technologies(
	"id" SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"technologyId" INTEGER NOT NULL,
	FOREIGN KEY("technologyId") REFERENCES technologies("id"),
	"projectId" INTEGER NOT NULl,
	FOREIGN KEY("projectId")REFERENCES projects("id")
);