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

describe('Lispico Admin Users Test', function () {

  describe('Login', function () {

    it('should successfully login', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);

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

  describe('Admin Users', function () {
    this.timeout(300000);

    it('should display listing', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/admin_users');

      // this will wait for the 'h1' selector to be loaded before proceeding
      await page.waitForSelector('h1');

      // this grabs the text from the h1 selector
      const title = await page.$eval('h1', function (h1) { return h1.innerText; });

      // assert that the text grabbed from the h1 selector matches our expected value
      assert.equal(title, 'Admin Users');

      // assert page has all the search fields
      assert.ok(page.$('#q[id]'));
      assert.ok(page.$('#q[last_name]'));
      assert.ok(page.$('#q[first_name]'));
      assert.ok(page.$('#q[login_enable]'));
    });

    it('should create user', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/admin_users/create');

      // this will wait for the 'h1' selector to be loaded before proceeding
      await page.waitForSelector('h1');

      // this grabs the text from the h1 selector
      const title = await page.$eval('h1', function (h1) { return h1.innerText; });

      // assert that the text grabbed from the h1 selector matches our expected value
      assert.equal(title, 'Admin Users - Create New');

      // fill up create fields
      await page.type('#last_name','Belo');
      await page.type('#first_name','Lawrence');
      await page.type('#email','lawrence.belo@fullspeedtechnologies.com');
      await page.select('#login_enable','1');
      await page.type('#password','fullspeed1A');
      await page.type('#password_confirmation','fullspeed1A');
      await page.keyboard.press('Enter');

      // wait for success
      await page.waitForSelector('#successMessage');
      const success = await page.$eval('#successMessage h4', function (msg) { return msg.innerText; });

      assert.match(success, /OK/);
    });

    it('should edit user', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/admin_users');

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
      assert.equal(title, 'Admin Users - Edit');

      // fill up edit fields
      await page.$eval('#last_name', el => el.value = 'Wayne');
      await page.$eval('#first_name', el => el.value = 'Bruce');
      await page.$eval('#email', el => el.value = 'bruce@wayneenterprises.com');

      await page.click('button[type="submit"]');

      // wait for success
      await page.waitForSelector('#successMessage');
      const success = await page.$eval('#successMessage h4', function (msg) { return msg.innerText; });

      assert.match(success, /OK/);
    });

    it('should delete user', async function () {
      // this opens a new tab in the browser 
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.setDefaultTimeout(0);

      // this opens the specified URL in tab we just opened
      await page.goto('https://lispico.local.host/admin/admin_users');

      // this will wait for the 'h1' selector to be loaded before proceeding
      await page.waitForSelector('h1');

      // this grabs the text from the h1 selector
      const title = await page.$eval('h1', function (h1) { return h1.innerText; });

      // assert that the text grabbed from the h1 selector matches our expected value
      assert.equal(title, 'Admin Users');

      // click delete link
      //await page.click('table>tbody>tr:nth-child(1)>td>a[href="#"]');
      await page.evaluate(() => {
        document.querySelector('td a[href="#"]').click();
      });

      // wait for delete confirmation modal
      await page.waitForSelector('button.btn-danger', { visible: true });
      await page.click('button.btn-danger');

      // close alert when it appears
      page.on('dialog', async dialog => {
        dialog.accept();
      });
      await page.waitForNavigation();

      // wait for success
      assert.equal(page.url(), 'https://lispico.local.host/admin/admin_users');
    });
  });

});

after(async () => {
  // close the browser
  await browser.close()
})