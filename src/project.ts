import { log } from "@clack/prompts";
import { exec } from "child_process";
import * as fs from "fs/promises";
import { resolve } from "path";
import { exit } from "process";

export async function copyProject(projectName: string, projectType: string) {
  await fs.cp(resolve(__dirname, "../templates/" + projectType), projectName, {
    recursive: true,
  });

  const packageJsonPath = resolve(projectName, "package.json");
  const packageData = await fs.readFile(packageJsonPath, "utf-8");

  const packageDataFramed = packageData.replace(
    `{{ PROJECT_NAME }}`,
    projectName,
  );

  await fs.writeFile(packageJsonPath, packageDataFramed, "utf-8");
}

export async function installDeps(projectName: string, packageManager: string) {
  await new Promise((rs, rj) => {
    exec(
      packageManager,
      { cwd: resolve(projectName) },
      (err, stdout, stderr) => {
        if (err) {
          log.error("Error while installing package.");
          log.error(stdout);
          log.error(stderr);
          rj();
        } else rs(0);
      },
    );
  }).catch(() => {
    exit(1);
  });
}
