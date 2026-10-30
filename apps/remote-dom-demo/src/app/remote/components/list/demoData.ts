// Demo dataset for the List example. Every entry is a character from a galaxy
// far, far away — named heroes and villains, plus generated clone/droid/pilot
// designations to reach a realistic size. The set is generated
// deterministically from the index so that IDs and filter values stay stable
// across renders.

export interface DemoCharacter {
  name: string;
  faction: string;
  id: string;
  bio: string;
  homeworld: string;
}

const heroes = [
  "Luke Skywalker",
  "Leia Organa",
  "Han Solo",
  "Chewbacca",
  "Obi-Wan Kenobi",
  "Yoda",
  "Darth Vader",
  "Padmé Amidala",
  "Mace Windu",
  "Qui-Gon Jinn",
  "Lando Calrissian",
  "Boba Fett",
  "Ahsoka Tano",
  "Din Djarin",
  "Rey Skywalker",
  "Finn",
  "Poe Dameron",
  "Kylo Ren",
  "Cassian Andor",
  "Jyn Erso",
  "Mon Mothma",
  "Bail Organa",
  "Wedge Antilles",
  "Admiral Ackbar",
  "Count Dooku",
  "Darth Maul",
  "General Grievous",
  "Sheev Palpatine",
  "Grand Moff Tarkin",
  "Galen Erso",
  "Saw Gerrera",
  "Hera Syndulla",
  "Kanan Jarrus",
  "Ezra Bridger",
  "Sabine Wren",
  "Zeb Orrelios",
  "Grand Admiral Thrawn",
  "Cad Bane",
  "Asajj Ventress",
  "Bo-Katan Kryze",
];

const factions = [
  "Rebel Alliance",
  "Galactic Empire",
  "Jedi Order",
  "Bounty Hunters",
  "Smugglers",
] as const;

const planets = [
  "Tatooine",
  "Alderaan",
  "Hoth",
  "Naboo",
  "Coruscant",
  "Dagobah",
  "Endor",
  "Yavin 4",
  "Kamino",
  "Bespin",
];

const bioTemplates = [
  "Serves the {faction} in the battle for the galaxy.",
  "Stationed on {planet} with the {faction}.",
  "Flies patrol missions across the {planet} system.",
  "Sworn to defend {planet} for the {faction}.",
  "Veteran of the battle of {planet}.",
  "Runs covert operations for the {faction}.",
  "Guards the {faction} outpost on {planet}.",
  "Trained in the ways of the Force on {planet}.",
  "Smuggles supplies past the Imperial blockade of {planet}.",
  "Commands a squadron in orbit over {planet}.",
];

/** Cyclic lookup — the modulo keeps the index in range, so this never fails. */
const pick = <T>(items: readonly T[], index: number): T =>
  items[index % items.length] as T;

/** Simple deterministic pseudo-random generator so data never shifts. */
const seeded = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const makeId = (index: number) =>
  Array.from({ length: 16 }, (_, position) =>
    idChars.charAt(
      Math.floor(seeded(index * 17 + position * 3) * idChars.length),
    ),
  ).join("");

const squadrons = ["Red", "Gold", "Rogue", "Green", "Blue"];

const makeName = (index: number): string => {
  if (index < heroes.length) {
    return pick(heroes, index);
  }
  const serial = 100 + index;
  switch (index % 4) {
    case 0:
      return `Clone Trooper CT-${serial}`;
    case 1:
      return `Stormtrooper TK-${serial}`;
    case 2:
      return `${pick(squadrons, index)} Squadron Pilot ${index % 12}`;
    default:
      return `Astromech R${index % 9}-D${(index * 3) % 9}`;
  }
};

const buildBio = (index: number) =>
  pick(bioTemplates, index)
    .replaceAll("{planet}", pick(planets, index))
    .replaceAll("{faction}", pick(factions, index));

export const demoData: DemoCharacter[] = Array.from(
  { length: 250 },
  (_, index) => ({
    name: makeName(index),
    faction: pick(factions, index),
    id: makeId(index),
    bio: buildBio(index),
    homeworld: pick(planets, index),
  }),
);
