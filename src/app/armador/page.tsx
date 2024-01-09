import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import api from "@/api";

export default async function BuilderPage() {
  const players = await api.players.list();

  return (
    <Table className="m-auto max-w-2xl border">
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Partidos</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map(({name, matches, score}) => (
          <TableRow key={name}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>{matches}</TableCell>
            <TableCell>{score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
