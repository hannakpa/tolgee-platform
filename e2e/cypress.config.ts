import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import  registerOldPlugins  from "./cypress/plugins"; // importa la lógica antigua
import { GLOBAL_RETRIES } from './cypress/common/globalRetries';

export default defineConfig({
  scrollBehavior: 'center',
  video: false,
  chromeWebSecurity: false,
  viewportHeight: 1080,
  viewportWidth: 1440,
  defaultCommandTimeout: 20000,
  e2e: {
    specPattern: "**/*.feature",
    async setupNodeEvents(on, config){
      // 1. Plugin de Cucumber
      await addCucumberPreprocessorPlugin(on, config);

      // 2. Preprocesador
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // 3. Plugins antiguos (como tareas personalizadas)
      return await registerOldPlugins(on, config); // ← muy importante retornar esto
    },
    retries: { runMode: GLOBAL_RETRIES }, // o tu constante GLOBAL_RETRIES
  },
});
