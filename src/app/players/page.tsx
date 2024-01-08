import api from "@/api";

export default async function PlayersPage() {
  const players = await api.players.list();

  return <div>{JSON.stringify(players, null, 2)}</div>;
}
