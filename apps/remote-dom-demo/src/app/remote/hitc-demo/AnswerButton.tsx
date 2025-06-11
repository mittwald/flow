import type { QuizController } from "@/app/remote/hitc-demo/useQuizController";
import { Button } from "@mittwald/flow-remote-react-components";
import type { FC } from "react";

interface Props {
  quiz: QuizController;
  index: number;
}

export const AnswerButton: FC<Props> = (props) => {
  const { quiz, index } = props;
  const { selectAnswer, takenAnswers, question } = quiz;

  return (
    <Button
      onClick={() => selectAnswer(index)}
      variant="outline"
      color="secondary"
      isDisabled={takenAnswers.includes(index)}
    >
      {question?.answers[index]}
    </Button>
  );
};
