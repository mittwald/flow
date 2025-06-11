import { getQuestions } from "./server";
import Quiz from "@/app/remote/hitc-demo/Quiz";

export default function Page() {
  return <Quiz questions={getQuestions()} />;
}
