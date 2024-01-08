import api from "@/api";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";

export default async function Home() {
  const matches = await api.match.list();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Fecha</TableHead>
          <TableHead>Equipo 1</TableHead>
          <TableHead>Equipo 2</TableHead>
          <TableHead>Goles Equipo 2</TableHead>
          <TableHead className="text-right">Goles Equipo 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map(({date, team1, team2, goals1, goals2}) => (
          <TableRow key={date}>
            <TableCell className="font-medium">{date}</TableCell>
            <TableCell>{team1}</TableCell>
            <TableCell>{team2}</TableCell>
            <TableCell className={cn({"font-bold text-green-500": goals1 > goals2})}>
              {goals1}
            </TableCell>
            <TableCell className={cn("text-right", {"font-bold text-green-500": goals2 > goals1})}>
              {goals2}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
