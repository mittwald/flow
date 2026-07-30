#!/usr/bin/env node
// @ts-check
/**
 * Version-contract guard — git-IO shell around version-contract-lib.mjs.
 *
 * Fails (exit 1) when a publishable package raises engines.node or narrows a
 * peer range without a breaking marker on the PR. See the design spec:
 * docs/superpowers/specs/2026-07-29-version-contract-guard-design.md
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { collectFindings, isBreakingMarker } from "./version-contract-lib.mjs";

const BASE_SHA = process.env.BASE_SHA;
const PR_TITLE = process.env.PR_TITLE ?? "";
const PR_BODY = process.env.PR_BODY ?? "";

if (!BASE_SHA) {
  console.error("BASE_SHA is required");
  process.exit(2);
}

/** @param {string[]} args */
function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

function listManifests() {
  return git(["ls-files"])
    .split("\n")
    .map((s) => s.trim())
    .filter((p) => p === "package.json" || p.endsWith("/package.json"));
}

/** @returns {object | null} */
function readHead(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/** @returns {object | null} */
function readBase(path) {
  try {
    return JSON.parse(git(["show", `${BASE_SHA}:${path}`]));
  } catch {
    return null; // absent on base (new file) or unreadable
  }
}

const packages = listManifests().map((path) => {
  const head = readHead(path);
  const base = readBase(path);
  return { name: head?.name ?? path, base, head };
});

const findings = collectFindings(packages);

if (findings.length === 0) {
  console.log(
    "Version contract OK — no engines.node raise or peer narrowing detected.",
  );
  process.exit(0);
}

const marked = isBreakingMarker(PR_TITLE, PR_BODY);
for (const f of findings) {
  const line = `${f.package}: ${f.surface} ${f.kind} (${f.detail})`;
  console.log(`::${marked ? "notice" : "error"}::${line}`);
}

if (marked) {
  console.log(
    "Breaking marker present — contract change acknowledged. The routing guard sends it to the major line.",
  );
  process.exit(0);
}

console.error(
  "::error::Version contract: a breaking engines.node/peer change is not marked breaking. " +
    "Add a breaking marker (`type!:` or a `BREAKING CHANGE:` body) so it routes to the major line, or revert the tightening.",
);
process.exit(1);
