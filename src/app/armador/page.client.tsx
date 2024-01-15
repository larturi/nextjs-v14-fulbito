"use client";

import type {Player} from "@/types";

import {useState} from "react";

import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {Model} from "../../types";

export default function BuilderPageClient({
  players: initialPlayers,
  onCreate,
}: {
  players: Player[];
  onCreate: (formData: FormData, model: Model) => void;
}) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [model, setModel] = useState<Model>(Model.JavaScript);
  const [countSelectedPlayers, setCountSelectedPlayers] = useState(0);

  function handleAddPlayer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPlayers((players) =>
      players.concat({name: formData.get("player") as string, score: 0, matches: 0}),
    );

    event.currentTarget.reset();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onCreate(formData, model);
  }

  return (
    <section className="m-auto grid max-w-sm gap-4">
      <form className="flex gap-4" onSubmit={handleAddPlayer}>
        <Input name="player" placeholder="Nombre del jugador" />
        <Button type="submit" variant="secondary">
          Agregar jugador
        </Button>
      </form>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Table className="border">
          <TableBody>
            {players.map(({name}) => (
              <TableRow key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-right">
                  <Checkbox
                    name="player"
                    value={name}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCountSelectedPlayers(countSelectedPlayers + 1);
                      } else {
                        setCountSelectedPlayers(countSelectedPlayers - 1);
                      }

                      return checked;
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button disabled={countSelectedPlayers < 10} type="submit">
          Armar Equipos
        </Button>
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="model">Usar OpenIA</label>
          <Checkbox
            name="model"
            value={model}
            onCheckedChange={(checked) => {
              if (checked) {
                setModel(Model.GPT);
              } else {
                setModel(Model.JavaScript);
              }

              return checked;
            }}
          />
        </div>
      </form>
    </section>
  );
}
