import { CodeEditor } from "@mittwald/flow-react-components";

<CodeEditor
  language="tsx"
  value={
    'import React, { FC } from "react";\n' +
    "\n" +
    "const ExampleCodeComponent: FC = () => {\n" +
    "  \n" +
    "  useEffect(() => {\n" +
    "    // some effect \n" +
    "  }, []);\n" +
    "  \n" +
    "  return <>Example JSX</>;\n" +
    "};"
  }
/>;
