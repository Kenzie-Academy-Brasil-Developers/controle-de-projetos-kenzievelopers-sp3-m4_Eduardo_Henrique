export interface IDeveloper {
  id: number;
  email: string;
  name: string;
}

export type IDeveloperRequest = Omit<IDeveloper, "id">;

export interface IDeveloperInfo {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId: number;
}

export type IDeveloperInfoRequest = Omit<IDeveloperInfo, "id">;

export interface IDeveloperAllInfos {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: Date | null;
}
