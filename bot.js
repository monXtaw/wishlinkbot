// bot.js
const puppeteer = require('puppeteer');

async function runBot() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://www.wishlink.com/itemintel', { waitUntil: 'networkidle2', timeout: 60000 });

    // small pause
    await new Promise(res => setTimeout(res, 2000));

    const buttons = await page.$$('button');
    let actionTaken = false;

    for (const btn of buttons) {
      const text = (await page.evaluate(el => el.innerText, btn)).trim();

      if (text === 'Follow') {
        await btn.click();
        console.log('✅ Clicked Follow');

        // wait until any button shows "Following"
        await page.waitForFunction(
          () => Array.from(document.querySelectorAll('button')).some(b => b.innerText.trim() === 'Following'),
          { timeout: 10000 }
        );

        console.log('🔄 Changed to Following');

        // wait 4 seconds after follow
        await new Promise(res => setTimeout(res, 4000));
        actionTaken = true;
        break;
      } else if (text === 'Following') {
        console.log('ℹ️ Already Following');
        actionTaken = true;
        break;
      }
    }

    if (!actionTaken) {
      console.log('❌ Follow/Following button not found');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await browser.close();
  }
}

if (require.main === module) runBot();
module.exports = runBot;
