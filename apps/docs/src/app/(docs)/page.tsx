import type { FC } from "react";
import { FlowDarkScopeStyle } from "@/app/_components/FlowDarkScope/FlowDarkScopeStyle";
import { HomePage } from "./_components/HomePage";

const Home: FC = () => (
  <>
    <FlowDarkScopeStyle />
    <HomePage />
  </>
);

export default Home;
