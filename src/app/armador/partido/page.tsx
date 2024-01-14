import type {Player} from "@/types";

import api from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MatchPageProps {
  searchParams: {
    players: string[];
  };
}

// Función para calcular la diferencia de puntuación entre dos equipos
const calculateScoreDifference = (team1: Player[], team2: Player[]): number => {
  const scoreTeam1 = team1.reduce((total, player) => total + player.score, 0);
  const scoreTeam2 = team2.reduce((total, player) => total + player.score, 0);

  return Math.abs(scoreTeam1 - scoreTeam2);
};

// Función para generar todas las combinaciones posibles
const generateCombinations = (players: Player[], teamSize: number): Player[][][] => {
  const combinations: Player[][][] = [];

  const generate = (team: Player[], rest: Player[]) => {
    if (team.length === teamSize) {
      combinations.push([team, rest]);

      return;
    }
    for (let i = 0; i < rest.length; i++) {
      const newTeam = [...team, rest[i]];
      const remainingPlayers = rest.filter((_, index) => index !== i);

      generate(newTeam, remainingPlayers);
    }
  };

  generate([], players);

  return combinations;
};

// Función principal para crear equipos balanceados
const createBalancedTeams = (players: Player[]): [Player[], Player[]] => {
  const teamSize = players.length / 2;
  const allCombinations = generateCombinations(players, teamSize);

  // Encontrar la combinación con la menor diferencia de puntuación
  let minDifference = Infinity;
  let bestCombination: [Player[], Player[]] = [[], []];

  for (const [team1, team2] of allCombinations) {
    const difference = calculateScoreDifference(team1, team2);

    if (difference < minDifference) {
      minDifference = difference;
      bestCombination = [team1, team2];
    }
  }

  return bestCombination;
};

export default async function MatchPage({searchParams: {players: draft}}: MatchPageProps) {
  const roster = await api.players.list();

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

  const [team1, team2] = createBalancedTeams(players);

  return (
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
  );
}
