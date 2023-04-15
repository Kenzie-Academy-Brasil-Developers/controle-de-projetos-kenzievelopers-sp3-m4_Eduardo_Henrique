export interface IProjects {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date | null;
  developerId: number;
}

export type IProjectsRequest = Omit<IProjects, "id">;

export interface IProjectsDescription {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: Date;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date | null;
  projectDeveloperId: number;
  technologyId: number | null;
  technologyName: string | null;
}
export interface ITechnology {
  id: number;
  name: string;
}

export type ITechnologyRequest = Omit<ITechnology,"id">