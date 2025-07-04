//import { PluginEvents, PluginConfigOptions } from "cypress";
import dotenvPlugin from "cypress-dotenv";
import path from "path";
const { isFileExist } = require("cy-verify-downloads");
import * as unzipping from "./unzipping.js";
import { readFile } from "xlsx";

import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";



export default async function registerOldPlugins(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // Cargar variables de entorno desde .env
  dotenvPlugin(config, {
    path: path.resolve(__dirname, "../../.test.docker.env"),
  });

  // Integración con Cucumber
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  // Tareas personalizadas
  on("task", {
    isFileExist,
    unzipping: unzipping.unzip,
    readXlsx: readFile,
  });

  return config;
}
