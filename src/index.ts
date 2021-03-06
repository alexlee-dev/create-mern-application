import * as Sentry from "@sentry/node";
import chalk from "chalk";
import commander from "commander";
import inquirer from "inquirer";
import updateNotifier from "update-notifier";
const pkg = require("../package.json");

/**
 * Initialize Sentry
 */
Sentry.init({
  dsn:
    "https://44111e696abc456c959aef6dfc97f6a7@o202486.ingest.sentry.io/5262339",
  release: "0.11.0",
});

import {
  buildSourceFiles,
  copyTemplateFiles,
  cleanUpDependencies,
  createProjectDirectory,
  createTSConfig,
  displaySuccessMessage,
  installDependencies,
  installDevDependencies,
  replaceTemplateValues,
} from "./init";
import {
  cleanupError,
  validateApplicationName,
  verifyNodeVersion,
} from "./util";

/**
 * create-mern-application
 */
const main = async (): Promise<void> => {
  let applicationName;
  let authorName = "YOUR NAME";

  try {
    // * Used to set the directory, application name, and inserted into templates
    let language: "js" | "ts";
    // * Default language is JavaScript
    language = "js";
    /**
     * The program that parses the initial user input
     */
    const program = new commander.Command("create-mern-application")
      .version("0.11.0")
      .arguments("<application-name>")
      .usage(`${chalk.blueBright("<application-name>")} [options]`)
      .action((name) => {
        applicationName = name;
      })
      .option(
        "--typescript",
        "Use TypeScript as the mern application source language",
        false
      )
      .option(
        "--interactive",
        "Have the bootstrapper walk you through the process",
        false
      )
      .on("--help", () => {
        console.log(
          `\nOnly ${chalk.blueBright("<application-name>")} is required.`
        );
        console.log(`\nIf you run into a problem, please open up a new issue:`);
        console.log(
          `${chalk.blueBright(
            "https://github.com/alexlee-dev/create-mern-application/issues/new"
          )}\n`
        );
      })
      .parse(process.argv);

    // * Verify Node Version (>=10.13.0)
    verifyNodeVersion();

    // * Application Name must exist, and not consist of illegal characters
    validateApplicationName(applicationName);
    if (!applicationName) return;

    if (program.interactive) {
      // * Interactive walk-thru

      // * Language
      const languageAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "language",
          message: "Please select a source language:",
          choices: [
            { value: "js", name: "JavaScript" },
            { value: "ts", name: "TypeScript" },
          ],
        },
      ]);
      const languageChoice: "js" | "ts" = languageAnswer.language;
      language = languageChoice;

      // * Author Name
      const nameAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Please input your name (optional):",
        },
      ]);
      const name: string = nameAnswer.name;
      authorName = name;
    }

    // * Set language to 'ts' if user passed --typescript flag
    if (program.typescript && !program.interactive) language = "ts";

    // * Creates a project directory and package.json
    await createProjectDirectory(applicationName, language);

    // * Installs dependencies
    await installDependencies(applicationName);

    // * Installs dev dependencies
    await installDevDependencies(applicationName, language);

    // * Copies template files
    await copyTemplateFiles(applicationName, language);

    if (language === "js") {
      // * Builds source files
      await buildSourceFiles(applicationName);

      // * Clean up no longer needed dependencies/devDependencies
      await cleanUpDependencies(applicationName);
    }

    // * Replaces template files placeholder values with real values for the application.
    await replaceTemplateValues(applicationName, language, authorName);

    // * Creates a tsconfig.json file
    if (language === "ts") await createTSConfig(applicationName);

    // * Displays a success message to the user
    displaySuccessMessage(applicationName);

    // * Notify user to update if need be
    updateNotifier({
      pkg: {
        name: "create-mern-application",
        version: pkg.version,
      },
    }).notify();
  } catch (error) {
    // * Ensure application directory is removed
    await cleanupError(applicationName);
    console.error(error);
    process.exit(1);
  }
};

export default main;
