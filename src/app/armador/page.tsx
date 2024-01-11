import {redirect} from "next/navigation";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import api from "@/api";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";

export default async function BuilderPage() {
  const players = await api.players.list();

  async function createTeams(formData: FormData) {
    "use server";
    const players = formData.getAll("player");

    const searchParams = new URLSearchParams();

    for (const player of players) {
      searchParams.append("players", player as string);
    }

    redirect(`/armador/partido?${searchParams.toString()}`);
  }

  return (
    <form action={createTeams} className="m-auto grid max-w-sm gap-4">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map(({name, matches, score}) => (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell className="text-right">
                <Checkbox name="player" value={name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="submit">Armar Equipos</Button>
    </form>
  );
}
