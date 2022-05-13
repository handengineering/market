module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  const isDev = config.watchForFileChanges;
  const configOverrides: Partial<Cypress.PluginConfigOptions> = {
    integrationFolder: "cypress/e2e",
    video: !process.env.CI,
    screenshotOnRunFailure: !process.env.CI,
  };
  Object.assign(config, configOverrides);

  // To use this:
  // cy.task('log', whateverYouWantInTheTerminal)
  on("task", {
    log(message) {
      console.log(message);
      return null;
    },
  });

  return config;
};
