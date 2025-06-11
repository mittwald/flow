export const questions = [
  {
    title: "Wie heißt der verrückte Erfinder, der die Zeitmaschine gebaut hat?",
    answers: [
      "Professor Brown",
      "Dr. Emmett Brown",
      "Doc Einstein",
      "Rick Sanchez",
    ],
    correctAnswer: 1,
  },
  {
    title: "Was ist der Name von Marty McFlys Freundin?",
    answers: ["Lorraine", "Jennifer", "Clara", "Mary"],
    correctAnswer: 1,
  },
  {
    title: "Welches Fahrzeug wird zur Zeitmaschine umgebaut?",
    answers: [
      "VW Käfer",
      "Pontiac Firebird",
      "DeLorean DMC-12",
      "Ford Mustang",
    ],
    correctAnswer: 2,
  },
  {
    title: "Wie viel Energie braucht der Fluxkompensator für eine Zeitreise?",
    answers: ["1.21 Megawatt", "121 Gigawatt", "1.21 Gigawatt", "88 Gigawatt"],
    correctAnswer: 2,
  },
  {
    title: "Welches Zitat stammt NICHT aus den Filmen?",
    answers: [
      "Straßen? Wo wir hinfahren, brauchen wir keine Straßen.",
      "Das ist schwer, Doc.",
      "Niemand nennt mich feige.",
      "Lebe lang und in Frieden.",
    ],
    correctAnswer: 3,
  },
  {
    title:
      "Was passiert, wenn Marty zu lange mit seiner Mutter in der Vergangenheit interagiert?",
    answers: [
      "Er wird älter",
      "Die Zeit bleibt stehen",
      "Er beginnt zu verschwinden",
      "Er verändert seine Blutgruppe",
    ],
    correctAnswer: 2,
  },
  {
    title: "Wie schnell muss der DeLorean fahren, um durch die Zeit zu reisen?",
    answers: ["100 km/h", "55 mph", "88 mph", "120 km/h"],
    correctAnswer: 2,
  },
  {
    title:
      "Was ersetzt in Teil III den Fluxkompensator, um den DeLorean zu starten?",
    answers: [
      "Ein Blitz",
      "Eine Dampflok",
      "Ein Atomreaktor",
      "Ein Hoverboard",
    ],
    correctAnswer: 1,
  },
  {
    title: "Welche Farbe hat Docs Hemd, als er das erste Mal 1955 auftaucht?",
    answers: [
      "Weiß mit Atommotiven",
      "Rot kariert",
      "Hellblau mit Uhren",
      "Gelb mit Raketen",
    ],
    correctAnswer: 0,
  },
  {
    title: "Wie lautet Docs berühmter Spruch?",
    answers: [
      "Großer Gott!",
      "Marty, du musst sofort zurück!",
      "Das ist verrückt!",
      "Zurück in die Zukunft!",
    ],
    correctAnswer: 0,
  },
] as const;

export type Questions = typeof questions;
