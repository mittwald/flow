import type { FC } from "react";
import { redirect } from "next/navigation";

const Home: FC = () => {
  redirect("01-getting-started/installation");
};

export default Home;
