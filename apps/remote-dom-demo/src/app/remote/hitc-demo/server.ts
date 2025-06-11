"use server";
import { questions } from "./questions";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export async function getQuestions() {
  await sleep(); // Simulate a delay for fetching questions
  return questions;
}
