import { useState } from "react";

export const useStatic = <T>(factory: () => T): T =>
  useState(() => factory())[0];
