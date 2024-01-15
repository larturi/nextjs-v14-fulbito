import type {Player} from "@/types";

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
export const createBalancedTeams = (players: Player[]): [Player[], Player[]] => {
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

// Función principal para crear equipos balanceados con OpenIA
export const createBalancedTeamsGPT = async (players: Player[]): Promise<[Player[], Player[]]> => {
  const prompt = `I give you an array of players with their scores: ${JSON.stringify(players)}.  
      Give me two arrays of balanced teams based on score. Only the response in JSON format without any additional details. Make sure not to say a single extra word as I want to use the output in an app.
      
      Each team must have the same number of players. The sum of the scores should be as close or equal as possible.
    
      You can follow this algorithm internally: Create an array with all possible team combinations. Return the optimal combination of teams.
      
      Expected response in this case: [[{name:"Juan",matches:4,score:30},{name:"Aron",matches:2,score:30},{name:"Lucas",matches:5,score:0},{name:"Lea",matches:5,score:0},{name:"Licha",matches:1,score:-30}],[{name:"Bauti",matches:1,score:30},{name:"Martin",matches:5,score:0},{name:"Pablo",matches:3,score:0},{name:"Jorge",matches:3,score:0},{name:"Carlos",matches:5,score:-0}]]".`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/gpt`, {
    method: "POST",
    body: JSON.stringify({prompt}),
  });

  const {data} = await response.json();

  const contentString = await data.choices[0].message.content;

  const contentObject = await JSON.parse(contentString);

  const team1 = contentObject[0];
  const team2 = contentObject[1];

  // await new Promise((resolve) => setTimeout(resolve, 300000));

  return [team1, team2];
};
