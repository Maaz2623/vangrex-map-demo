import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
});

const page = await browser.newPage();

await page.goto("http://localhost:3000/dashboard");

console.log("\n===== TODO DOM STRUCTURE =====\n");

const todos = await page
  .locator('input[type="checkbox"]')
  .evaluateAll((checkboxes) => {
    return checkboxes.map((checkbox) => {
      const container = checkbox.closest("div");

      return {
        checkbox: checkbox.outerHTML,

        parent: checkbox.parentElement?.outerHTML,

        container: container?.outerHTML,
      };
    });
  });

console.dir(todos, {
  depth: null,
});

await browser.close();
