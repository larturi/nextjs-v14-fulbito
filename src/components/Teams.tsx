import {createBalancedTeams, createBalancedTeamsGPT} from "@/app/lib/data/create-teams";
import api from "@/api";

import {Model, type Player} from "../types";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface MatchPageProps {
  searchParams: {
    players: string[];
    model: Model;
  };
}

export default async function Teams({searchParams}: MatchPageProps) {
  let team1: Player[] = [];
  let team2: Player[] = [];

  const roster = await api.players.list();

  const draft = searchParams.players;
  let model = searchParams.model;

  const players = draft
    .map(
      (name) =>
        roster.find((player) => player.name === name) ?? {
          name,
          matches: 0,
          score: 0,
        },
    )
    .sort((a, b) => b.score - a.score);

  if (model === Model.JavaScript) {
    [team1, team2] = createBalancedTeams(players);
  } else {
    if (process.env.OPENAI_API_KEY === "") {
      [team1, team2] = createBalancedTeams(players);
      model = Model.JavaScript;
    } else {
      [team1, team2] = await createBalancedTeamsGPT(players);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Table className="m-auto max-w-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Equipo 1</TableHead>
            <TableHead className="text-right">Equipo 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({length: Math.max(team1.length, team2.length)}).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                {team1[index]?.name ? `${team1[index].name} (${team1[index].score})` : "-"}
              </TableCell>
              <TableCell className="text-right">
                {team2[index]?.name ? `${team2[index].name} (${team2[index].score})` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total: {team1.reduce((total, player) => total + player.score, 0)}</TableCell>
            <TableCell className="text-right">
              Total: {team2.reduce((total, player) => total + player.score, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="mt-10 w-full max-w-[28rem] bg-purple-600 px-3 py-2 text-center font-normal">
        Se calculó el optimo con {model === Model.JavaScript ? "JavaScript" : "OpenAI"}
      </div>
    </div>
  );
}
