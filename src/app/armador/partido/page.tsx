import api from "@/api";

interface MatchPageProps {
  searchParams: {
    players: string[];
  };
}

export default async function MatchPage({searchParams: {players: draft}}: MatchPageProps) {
  const roster = await api.players.list();

  const players = draft.map(
    (name) =>
      roster.find((player) => player.name === name) ?? {
        name,
        matches: 0,
        score: 0,
      },
  );

  return <div>{JSON.stringify(players, null, 2)}</div>;
}
