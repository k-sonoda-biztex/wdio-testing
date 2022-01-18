import { config as sharedConfig } from "./wdio.shared.conf";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  ...{
    capabilities: [
      {
        maxInstances: 1,
        browserName: "chrome",
        acceptInsecureCerts: true,
        // If outputDir is provided WebdriverIO can capture driver session logs
        // excludeDriverLogs: ['bugreport', 'server'], // pass '*' to exclude all driver session logs
        "wdio:devtoolsOptions": {
          headless: false,
        },
      },
    ],
  },
};
