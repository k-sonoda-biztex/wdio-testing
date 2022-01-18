import { config as sharedConfig } from "./wdio.shared.conf";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  ...{
    automationProtocol: "webdriver",
    capabilities: [
      {
        browserName: "chrome",
        "goog:chromeOptions": {},
      },
    ],
  },
};
