const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const fetch = require("node-fetch");

async function scrollUntilElementVisible(url, selector) {
  const browser = await puppeteer.launch({
    headless: `new`,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  try {
    const startTime = Date.now();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    let elementVisible = false;

    while (!elementVisible) {
      // Scroll down
      await page.keyboard.press("PageDown");

      // Wait for a short moment to allow content loading
      // Check if the element is visible
      elementVisible = await page.evaluate((selector) => {
        const element = document.evaluate(
          selector,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        return element && element.getBoundingClientRect().top >= 0;
      }, selector);
    }

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    console.log(`Time taken: ${durationInSeconds} seconds`);

    return page; // Return the page object for further use
  } catch (error) {
    console.error("Error:", error);
  }
}

async function scrapeElementValues(page, startChildIndex, endChildIndex) {
  try {
    const results = [];

    for (let i = startChildIndex; i <= endChildIndex; i++) {
      let containerXPath, valueXPath, rankXPath, additionalXPath;

      if (i === 51 || (i > 51 && (i - 51) % 50 === 0)) {
        // Use different XPaths for i equal to 51 or multiples of 50
        valueXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div/div[1]/div[2]`;
        containerXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div/div[3]`;
        rankXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div/div[4]/div[2]`;
        additionalXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div/div[5]/div[2]`;
      } else {
        valueXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div[1]/div[2]`;
        containerXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div[3]`;
        rankXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div[4]/div[2]`;
        additionalXPath = `/html/body/div/div/div[12]/div[3]/div/div[${i}]/div[5]/div[2]`;
      }

      const user = await page.evaluate((xpath) => {
        const element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        return element ? element.textContent.trim() : null;
      }, containerXPath);

      const rank = await page.evaluate((xpath) => {
        const element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        return element ? element.textContent.trim() : null;
      }, valueXPath);
      const level = await page.evaluate((xpath) => {
        const element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        return element ? element.textContent.trim() : null;
      }, rankXPath);

      const xp = await page.evaluate((xpath) => {
        const element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        return element ? element.textContent.trim() : null;
      }, additionalXPath);

      const result = {
        user: user,
        rank: rank,
        level: level,
        xp: xp,
      };

      results.push(result);
    }

    return results;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function pushFilesToGitHub(files, repository, branch, githubToken) {
  try {
    const baseUrl = "https://api.github.com";
    const url = `${baseUrl}/repos/${repository}/git/trees/${branch}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const sha = data.sha;

    const tree = files.map((file) => ({
      path: file.path,
      mode: "100644",
      type: "blob",
      content: file.content,
    }));

    const treeData = {
      base_tree: sha,
      tree: tree,
    };

    const createTreeResponse = await fetch(`${baseUrl}/repos/${repository}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treeData),
    });

    const createTreeResult = await createTreeResponse.json();

    const commitData = {
      message: "Automatically generated commit",
      tree: createTreeResult.sha,
      parents: [sha],
    };

    const createCommitResponse = await fetch(`${baseUrl}/repos/${repository}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commitData),
    });

    const createCommitResult = await createCommitResponse.json();

    await fetch(`${baseUrl}/repos/${repository}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha: createCommitResult.sha,
        force: true,
      }),
    });
  } catch (error) {
    console.error("Error while pushing files to GitHub:", error);
  }
}

async function runScript() {
  const url = "https://amaribot.com/leaderboard/835294705074962472";
  const targetElementXPath =
    "/html/body/div/div/div[12]/div[3]/div/div[1000]/div[2]"; // Update with the correct XPath
  const startIndex = 1;
  const endIndex = 1000;
  const batchSize = 100;
  const page = await scrollUntilElementVisible(url, targetElementXPath);
  for (let start = startIndex; start <= endIndex; start += batchSize) {
    const end = Math.min(start + batchSize - 1, endIndex);

    if (page) {
      const lb = await scrapeElementValues(page, start, end);

      // Create a JSON object
      const result = {
        lb,
      };

      // Write the JSON object to a file
      const outputFile = `${start}-${end}.json`;
      await fs.writeFile(outputFile, JSON.stringify(result, null, 2));

    }
  }
  await page.close();
}

// Run the combined script
runScript()
setInterval(runScript, 60000);