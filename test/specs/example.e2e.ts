import { setupBrowser } from "@testing-library/webdriverio";
describe("Example ページは", () => {
  it("IANAの画面を開く", async () => {
    setupBrowser(browser);

    browser.url("/");
    await (await browser.getByText("More information...")).click();

    await (
      await browser.getByText("IANA-managed Reserved Domains")
    ).waitForExist();
    // expect(
    //   await browser.getByText("IANA-managed Reserved Domains")
    // ).toBeDefined();
    // await browser.debug();
  });
});
