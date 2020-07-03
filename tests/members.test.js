// import the puppeteer library
const puppeteer = require('puppeteer');
// import the assertion library
const assert = require('assert');

// setup a reusable browser so that we dont have to launch a new browser for each test
let browser;

// test setup
before(async () => {
  // launch the browser 
  browser = await puppeteer.launch({ 
    ignoreHTTPSErrors: true,
    headless: false
  });
})

describe('Lispico Members Pages Test', function () {
 
  describe('Login', function () {

    it('should successfully login', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/login');

      // this will wait for the 'h2' selector to be loaded before proceeding
      await page.waitForSelector('h2');

      // this grabs the text from the h2 selector
      const title = await page.$eval('h2', function (h2) { return h2.innerText; });

      // assert that the text grabbed from the h2 selector matches our expected value
      assert.equal(title, 'りすぴこ');

      await page.type('#email','root@fullspeed.co.jp');
      await page.type('#password','fullspeed');
      await page.keyboard.press('Enter');

      await page.waitForNavigation();
      assert.equal(page.url(), 'https://lispico.local.host/admin')

    }).timeout(60000);

  });

  describe('Members', function () {
    this.timeout(300000);

    it('should display listing', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/members');

      // this will wait for the 'h1' selector to be loaded before proceeding
      await page.waitForSelector('h1');

      // this grabs the text from the h1 selector
      const title = await page.$eval('h1', function (h1) { return h1.innerText; });

      // assert that the text grabbed from the h1 selector matches our expected value
      assert.equal(title, 'Members');

      // assert page has all the search fields
      assert.ok(page.$('#q[id]'));
      assert.ok(page.$('#q[last_name]'));
      assert.ok(page.$('#q[first_name]'));
      assert.ok(page.$('#q[email]'));
      assert.ok(page.$('#q[stripe_id]'));
      assert.ok(page.$('#q[enable_direct_message]'));
    });

    it('should create member', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/members/create');

      // this will wait for the 'h1' selector to be loaded before proceeding
      await page.waitForSelector('h1');

      // this grabs the text from the h1 selector
      const title = await page.$eval('h1', function (h1) { return h1.innerText; });

      // assert that the text grabbed from the h1 selector matches our expected value
      assert.equal(title, 'Members - Create New');

      // fill up create fields
      await page.type('#last_name','Belo');
      await page.type('#first_name','Lawrence');
      await page.type('#email','lawrence.belo@fullspeedtechnologies.com');
      await page.type('#last_name_kana','ベロ');
      await page.type('#first_name_kana','ローレンス');
      await page.type('#phone_number','123456789');
      await page.type('#enable_direct_message','Receive');
      await page.type('#zip_code','1900000');
      await page.type('#address1','東京都立川市');
      await page.type('#address2','Avenue St.');
      await page.type('#address3','Some building.');
      await page.type('#password','fullspeed1A');
      await page.type('#password_confirmation','fullspeed1A');
      await page.keyboard.press('Enter');

      await page.waitForNavigation();

      // wait for success
      await page.waitForSelector('#successMessage');
      const success = await page.$eval('#successMessage h4', function (msg) { return msg.innerText; });

      assert.match(success, /OK/);
    });

    it('should edit member', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/members');

      // wait for edit to be available
      await page.waitForSelector('h1');

      // click on 1st link for edit
      // this method of clicking is because puppeteer cannot click an empty link
      await page.evaluate(() => {
        document.querySelector('td a').click();
      });

      // this will wait for the 'h1' selector to be loaded before proceeding
      await page.waitForSelector('h1');

      // this grabs the text from the h1 selector
      const title = await page.$eval('h1', function (h1) { return h1.innerText; });

      // assert that the text grabbed from the h1 selector matches our expected value
      assert.equal(title, 'Members - Edit');

      // fill up edit fields
      await page.$eval('#last_name', el => el.value = 'Parker');
      await page.$eval('#first_name', el => el.value = 'Peter');
      await page.$eval('#email', el => el.value = 'peterparker@dailybugle.com');
      await page.$eval('#last_name_kana', el => el.value = 'ペタ');
      await page.$eval('#first_name_kana', el => el.value = 'パーカ');
      await page.$eval('#phone_number', el => el.value = '123456789');
      await page.$eval('#zip_code', el => el.value = '1900000');
      await page.$eval('#address1', el => el.value = '東京都立川市');
      await page.$eval('#address2', el => el.value = 'New York St.');
      await page.$eval('#address3', el => el.value = 'Some building.');
      await page.$eval('#password_for_edit', el => el.value = 'fullspeed1A');
      await page.$eval('#password_for_edit_confirmation', el => el.value = 'fullspeed1A');

      await page.click('button[type="submit"]');

      await page.waitForNavigation();

      // wait for success
      await page.waitForSelector('#successMessage');
      const success = await page.$eval('#successMessage h4', function (msg) { return msg.innerText; });

      assert.match(success, /OK/);
    });

  });

});

after(async () => {
  // close the browser
  await browser.close()
})