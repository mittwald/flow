import { readCachedProjectGraph } from "nx/src/project-graph/project-graph.js";
import * as process from "process";

const projectName = process.argv[2];

if (!projectName) {
  throw new Error("Argument missing");
}

const graph = readCachedProjectGraph();
const projects = Object.entries(graph.nodes).map(([name]) => name);

if (!(projectName in graph.dependencies)) {
  throw new Error(`Unknown project ${projectName}`);
}

const dependencies = graph.dependencies[projectName]
  .map((p) => p.target)
  .filter((p) => projects.includes(p));

console.log(dependencies.join(","));
