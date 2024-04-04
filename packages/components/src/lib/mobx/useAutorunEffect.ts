import { useEffect } from "react";
import { autorun } from "mobx";

export const useAutorunEffect = (effect: () => void): void =>
  useEffect(autorun(effect));
