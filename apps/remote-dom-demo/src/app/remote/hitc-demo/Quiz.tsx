"use client";
import {
  Alert,
  Badge,
  Button,
  Flex,
  Heading,
  Text,
} from "@mittwald/flow-remote-react-components";
import { use, useEffect, useState } from "react";
import { type Questions } from "./questions";

interface Props {
  questions: Promise<Questions>;
}

export default function Quiz(props: Props) {
  const questions = use(props.questions);
  const [mistakes, setMistakes] = useState(0);
  const [takenAnswers, setTakenAnswers] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const question = questions[questionIndex];

  const selectAnswer = (index: number) => {
    setShowWrongAnswer(false);
    setTakenAnswers((prev) => [...prev, index]);
    if (index === question?.correctAnswer) {
      setQuestionIndex((i) => i + 1);
      setTakenAnswers([]);
    } else {
      setMistakes((m) => m + 1);
      setShowWrongAnswer(true);
    }
  };

  useEffect(() => {
    if (showWrongAnswer) {
      const timer = setTimeout(() => {
        setShowWrongAnswer(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showWrongAnswer]);

  if (!question) {
    return <Heading>Gut gemacht! {mistakes} Fehler</Heading>;
  }

  const wrongAnswer = showWrongAnswer && (
    <Alert status="warning">
      <Text>Das war leider falsch. Versuch's nochmal!</Text>
    </Alert>
  );

  const answerButtons = question.answers.map((answer, index) => (
    <Button
      key={index}
      onClick={() => selectAnswer(index)}
      variant="outline"
      color="secondary"
      isDisabled={takenAnswers.includes(index)}
    >
      {answer}
    </Button>
  ));

  return (
    <Flex direction="column" rowGap="m">
      <Heading>Frage {questionIndex + 1}</Heading>
      <Text elementType="p">{question.title}</Text>
      <Flex direction="row" gap="s" wrap="wrap">
        {answerButtons}
      </Flex>
      <Badge>{mistakes} Fehler</Badge>
      {wrongAnswer}
    </Flex>
  );
}
