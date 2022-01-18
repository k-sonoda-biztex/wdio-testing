import { config as sharedConfig } from "./wdio.shared.conf";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  ...{
    services: [],
    capabilities: [],
  },
};
