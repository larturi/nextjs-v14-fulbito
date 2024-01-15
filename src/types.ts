export interface Match {
  date: string;
  team1: string;
  team2: string;
  goals1: number;
  goals2: number;
}

export interface Player {
  name: string;
  matches: number;
  score: number;
}

export enum Model {
  JavaScript = "js",
  GPT = "gpt",
}

export const MODELS = {
  [Model.JavaScript]: {
    label: "JavaScript",
    description: "Modelo basado en JavaScript",
  },
  [Model.GPT]: {
    label: "GPT",
    description: "Modelo basado en GPT",
  },
};
