#!/usr/bin/env node

const puppeteer = require('puppeteer');

const config = {
  launchOptions: {
    headless: false,
  },
  searchEngineUrl: 'https://www.google.com',
  searchQuery: 'Litify',
  url: 'https://www.litify.com/',
  screenshotPath: 'screenshot.png',
  element: {
    searchInput: 'input[name="q"]',
    results: '#rso',
    firstResultLink: '#rso .g link'
  },
  msg: {
    goodNews: `Life is good! Litify is #1!`,
    badNews: `Red alert! Red alert! Enemy approaching!`
  }
}

const { element, msg } = config;

(async () => {
  const browser = await puppeteer.launch(config.launchOptions);
  const page = await browser.newPage();
  await page.goto(config.searchEngineUrl);
  await page.type(element.searchInput, config.searchQuery);
  await page.keyboard.press('Enter')
  await page.waitForSelector(element.results);
  await page.screenshot({path: config.screenshotPath});
  const firstResultHref = await page.$eval(element.firstResultLink, el => el.href); 
  await browser.close();
  console.log(`First result links to: ${firstResultHref}`);
  const output = firstResultHref === config.url ? msg.goodNews : msg.badNews;
  console.info(output);
})();