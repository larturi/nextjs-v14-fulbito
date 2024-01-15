"use client";

import type {Model} from "../../../types";

import Teams from "@/components/Teams";

interface MatchPageProps {
  searchParams: {
    players: string[];
    model: Model;
  };
}

export default function MatchPage({searchParams}: MatchPageProps) {
  return <Teams searchParams={searchParams} />;
}
