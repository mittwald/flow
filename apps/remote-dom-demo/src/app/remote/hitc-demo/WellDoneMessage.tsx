import type { QuizController } from "@/app/remote/hitc-demo/useQuizController";
import { Heading } from "@mittwald/flow-remote-react-components";
import type { FC } from "react";

interface Props {
  quiz: QuizController;
}

export const WellDoneMessage: FC<Props> = (props) => {
  const { quiz } = props;
  return <Heading>Gut gemacht! {quiz.mistakes} Fehler</Heading>;
};
