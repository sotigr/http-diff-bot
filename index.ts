import puppeteer from 'puppeteer';
import fs from "fs"
import { WebhookClient } from 'discord.js'

(async () => {
    const CACHE_PATH = "/data/hash.txt"
    const SCRAPE_URL = process.env.PAGE_URL || ""
    const WEBHOOK_URL = process.env.WEBHOOK_URL || ""
    const CSS_SELECTOR = process.env.CSS_SELECTOR || "html"
    const BOT_NAME = process.env.BOT_NAME || "HTTP DIFF BOT"
    const BOT_ICON = process.env.BOT_ICON || "https://i.imgur.com/KEungv8.png"

    let lastHash = ""
    if (fs.existsSync(CACHE_PATH)) {
        lastHash = fs.readFileSync(CACHE_PATH).toString()
    }
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(SCRAPE_URL);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });


    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
        CSS_SELECTOR
    );
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    var crypto = require('crypto');
    var name = fullTitle;
    var hash = crypto.createHash('md5').update(name).digest('hex');
    if (hash != lastHash) {
        try {
            fs.mkdirSync("/data")
        } catch (e) {}
        fs.writeFileSync(CACHE_PATH, hash)

        const webhookClient = new WebhookClient({
            url: WEBHOOK_URL,
        });

        console.log("Found New Hash:", hash)

        webhookClient.send({
            content: 'New update on ' + SCRAPE_URL,
            username: BOT_NAME,
            avatarURL: BOT_ICON,
        });
    }
    await browser.close();
})();