"use client";
import type { Questions } from "@/app/remote/hitc-demo/questions";
import { useState, useEffect } from "react";

export const useQuizController = (questions: Questions) => {
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

  const result = {
    question,
    questionIndex: questionIndex + 1,
    selectAnswer,
    mistakes,
    takenAnswers,
    showWrongAnswer,
  };

  if (question) {
    return {
      ...result,
      question,
      isDone: false as const,
    };
  }

  return {
    ...result,
    isDone: true as const,
  };
};

export type QuizController = ReturnType<typeof useQuizController>;
