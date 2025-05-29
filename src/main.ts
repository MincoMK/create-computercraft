#!/usr/bin/env node

import { intro, log, outro, select, spinner, text } from "@clack/prompts";
import validate from "validate-npm-package-name";
import * as fs from "fs/promises";
import * as fss from "fs";
import { resolve } from "path";
import { exit } from "process";
import { exec } from "child_process";
import { info } from "console";
import { copyProject, installDeps } from "./project";

async function main() {
  intro("create-computercraft");

  const projectName = await text({
    message: "What is your project name?",
    initialValue: process.argv?.[2] ?? undefined,
    validate(value) {
      if (!validate(value))
        return "Project name should satisfy NPM package name rules.";
      if (fss.existsSync(value)) return "Project already exists.";
    },
  });

  if (typeof projectName != "string") {
    log.error("Project name is invalid.");
    exit(1);
  }

  const projectType = await select({
    message: "Which type of project do you need?",
    options: [
      {
        value: "executable",
        label: "Executable",
        hint: "Final single lua file",
      },
      { value: "library", label: "Library", hint: "NPM compatible library" },
    ],
  });

  if (typeof projectType != "string") {
    log.error("Project type is invalid.");
    exit(1);
  }

  const packageManager = await select({
    message: "Which package manager would you love to?",
    options: [
      { value: "npm i", label: "npm" },
      { value: "yarn add", label: "yarn" },
      { value: "pnpm i", label: "pnpm" },
      { value: "none", label: "I'd install it myself" },
    ],
  });

  if (typeof packageManager != "string") {
    log.error("Package manager is invalid.");
    exit(1);
  }

  await copyProject(projectName, projectType);

  if (packageManager != "none") {
    const s = spinner();
    s.start("Installing dependencies...");

    await installDeps(projectName, packageManager);

    s.stop("Installed dependencies.");
  }

  info("Run build script to start.");
  outro("You're all set!");
}

main();
