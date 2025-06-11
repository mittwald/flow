"use client";
import {
  Badge,
  Flex,
  Heading,
  Text,
} from "@mittwald/flow-remote-react-components";
import { use } from "react";
import { type Questions } from "./questions";
import { useQuizController } from "@/app/remote/hitc-demo/useQuizController";
import { AnswerButton } from "@/app/remote/hitc-demo/AnswerButton";
import { WrongAnswerAlert } from "@/app/remote/hitc-demo/WrongAnswerAlert";
import { WellDoneMessage } from "@/app/remote/hitc-demo/WellDoneMessage";

interface Props {
  questions: Promise<Questions>;
}

export default function Quiz(props: Props) {
  const questions = use(props.questions);
  const quizController = useQuizController(questions);
  const { question, questionIndex, mistakes, showWrongAnswer, isDone } =
    quizController;

  if (isDone) {
    return <WellDoneMessage quiz={quizController} />;
  }

  return (
    <Flex direction="column" rowGap="m">
      <Heading>Frage {questionIndex}</Heading>
      <Text elementType="p">{question.title}</Text>

      <Flex direction="row" gap="s" wrap="wrap">
        {question.answers.map((_, index) => (
          <AnswerButton index={index} key={index} quiz={quizController} />
        ))}
      </Flex>

      <Badge>{mistakes} Fehler</Badge>

      {showWrongAnswer && <WrongAnswerAlert />}
    </Flex>
  );
}
