
````ts
// Test đơn giản
import { test, expect } from '@playwright/test';

test('basic test example', async ({ page }) => {
  // Điều hướng đến trang
  await page.goto('https://playwright.dev/');

  // Kiểm tra title
  await expect(page).toHaveTitle(/Playwright/);

  // Click vào link
  await page.getByRole('link', { name: 'Get started' }).click();

  // Kiểm tra URL
  await expect(page).toHaveURL(/.*intro/);
});
// Các locator strategies
test('locator strategies', async ({ page }) => {
  await page.goto('https://example.com');

  // By role
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // By text
  await page.getByText('Welcome').click();
  
  // By placeholder
  await page.getByPlaceholder('Enter your email').fill('test@example.com');
  
  // By label
  await page.getByLabel('Password').fill('123456');
  
  // By test id
  await page.getByTestId('login-button').click();
  
  // CSS selector
  await page.locator('.submit-btn').click();
  
  // XPath
  await page.locator('//button[@type="submit"]').click();
});
// Form interactions
test('form interactions', async ({ page }) => {
  await page.goto('https://example.com/form');

  // Input text
  await page.fill('[name="username"]', 'testuser');
  await page.fill('#password', 'password123');

  // Select dropdown
  await page.selectOption('select#country', 'vietnam');
  
  // Checkbox
  await page.check('[name="agree"]');
  
  // Radio button
  await page.check('[value="male"]');
  
  // Upload file
  await page.setInputFiles('[type="file"]', 'path/to/file.jpg');
  
  // Submit form
  await page.click('[type="submit"]');
});
// Assertions (Kiểm tra)
// 1. Page assertions
test('page assertions', async ({ page }) => {
  await page.goto('https://example.com');

  // Check page title
  await expect(page).toHaveTitle('Expected Title');
  
  // Check URL
  await expect(page).toHaveURL('https://example.com/expected-path');
  
  // Check if element exists
  await expect(page.locator('h1')).toBeVisible();
  
  // Check element text
  await expect(page.locator('h1')).toHaveText('Welcome');
  
  // Check element attribute
  await expect(page.locator('input')).toHaveAttribute('type', 'text');
  
  // Check element count
  await expect(page.locator('li')).toHaveCount(5);
});
// 2. Element states
test('element states', async ({ page }) => {
  await page.goto('https://example.com');

  // Visibility
  await expect(page.locator('#element')).toBeVisible();
  await expect(page.locator('#hidden')).toBeHidden();
  
  // Enabled/Disabled
  await expect(page.locator('button')).toBeEnabled();
  await expect(page.locator('input[disabled]')).toBeDisabled();
  
  // Checked state
  await expect(page.locator('[type="checkbox"]')).toBeChecked();
  
  // Focus
  await expect(page.locator('input')).toBeFocused();
});
// 3. Text and content
test('text assertions', async ({ page }) => {
  await page.goto('https://example.com');

  // Exact text match
  await expect(page.locator('h1')).toHaveText('Exact Title');
  
  // Partial text match
  await expect(page.locator('p')).toContainText('partial text');
  
  // Regex match
  await expect(page.locator('span')).toHaveText(/\d+ items/);
  
  // Multiple elements
  await expect(page.locator('li')).toHaveText(['Item 1', 'Item 2', 'Item 3']);
});
// Waiting và Timing
// 1. Auto-waiting
// Playwright tự động chờ elements:

test('auto-waiting example', async ({ page }) => {
  await page.goto('https://example.com');

  // Playwright tự động chờ element visible trước khi click
  await page.click('button#load-data');
  
  // Tự động chờ element có text
  await expect(page.locator('#result')).toHaveText('Data loaded');
});
// 2. Explicit waiting
test('explicit waiting', async ({ page }) => {
  await page.goto('https://example.com');

  // Wait for element
  await page.waitForSelector('#dynamic-content');
  
  // Wait for navigation
  await page.click('a[href="/next-page"]');
  await page.waitForURL('**/next-page');
  
  // Wait for API response
  const responsePromise = page.waitForResponse('**/api/data');
  await page.click('#fetch-data');
  const response = await responsePromise;
  
  // Wait for function
  await page.waitForFunction(() => {
    return document.querySelectorAll('li').length > 5;
  });
  
  // Wait with timeout
  await page.waitForSelector('#slow-element', { timeout: 10000 });
});
// Page Object Model
// 1. Tạo Page Object
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
// 2. Sử dụng Page Object
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('validuser', 'validpass');
  
  await expect(page).toHaveURL('/dashboard');
});

test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('invaliduser', 'wrongpass');
  
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain('Invalid credentials');
});
// API Testing
// 1. API requests
import { test, expect } from '@playwright/test';

test('API testing', async ({ request }) => {
  // GET request
  const response = await request.get('/api/users');
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(users).toHaveLength(10);

  // POST request
  const newUser = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });
  expect(newUser.status()).toBe(201);

  // PUT request
  const updatedUser = await request.put('/api/users/1', {
    data: {
      name: 'John Smith'
    }
  });
  expect(updatedUser.status()).toBe(200);

  // DELETE request
  const deletedUser = await request.delete('/api/users/1');
  expect(deletedUser.status()).toBe(204);
});
// 2. Authentication
// Setup authentication
test.beforeEach(async ({ request }) => {
  // Login and get token
  const response = await request.post('/api/auth/login', {
    data: {
      username: 'testuser',
      password: 'testpass'
    }
  });
  
  const { token } = await response.json();
  
  // Set authorization header for subsequent requests
  await request.setExtraHTTPHeaders({
    'Authorization': `Bearer ${token}`
  });
});
Network Interception
1. Mock API responses
test('mock API response', async ({ page }) => {
  // Mock API call
  await page.route('**/api/users', async (route) => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUsers)
    });
  });

  await page.goto('/users');
  
  // Verify mocked data is displayed
  await expect(page.locator('text=John Doe')).toBeVisible();
  await expect(page.locator('text=Jane Smith')).toBeVisible();
});
2. Intercept network requests
test('intercept network requests', async ({ page }) => {
  // Listen to all requests
  page.on('request', request => {
    console.log('Request:', request.url());
  });

  // Listen to responses
  page.on('response', response => {
    console.log('Response:', response.url(), response.status());
  });

  // Wait for specific request
  const requestPromise = page.waitForRequest('**/api/data');
  await page.click('#load-data');
  const request = await requestPromise;
  
  console.log('Request payload:', request.postData());
});
Screenshots và Videos
1. Screenshots
test('take screenshots', async ({ page }) => {
  await page.goto('https://example.com');

  // Full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });

  // Element screenshot
  await page.locator('#header').screenshot({ path: 'header.png' });

  // Screenshot trong test
  await page.click('#button');
  await page.screenshot({ path: 'after-click.png' });
});
2. Video recording
// Trong playwright.config.ts
export default defineConfig({
  use: {
    // Record video cho failed tests
    video: 'retain-on-failure',
    
    // Record video cho tất cả tests
    // video: 'on',
  },
});
Mobile Testing
1. Mobile emulation
import { test, expect, devices } from '@playwright/test';

test('mobile testing', async ({ browser }) => {
  // Create mobile context
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Test mobile-specific features
  await expect(page.locator('.mobile-menu')).toBeVisible();
  
  await context.close();
});
2. Touch gestures
test('touch gestures', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPad Pro'],
    hasTouch: true,
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Tap
  await page.locator('#button').tap();

  // Swipe
  await page.touchscreen.tap(100, 100);
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 100);
  await page.mouse.up();
});
Test Organization
1. Test groups và hooks
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup trước mỗi test
    await page.goto('/admin');
    await page.fill('[name="username"]', 'admin');
    await page.fill('[name="password"]', 'admin123');
    await page.click('[type="submit"]');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup sau mỗi test
    await page.click('#logout');
  });

  test('create new user', async ({ page }) => {
    await page.click('#create-user');
    await page.fill('#name', 'New User');
    await page.click('#save');
    
    await expect(page.locator('text=User created')).toBeVisible();
  });

  test('delete user', async ({ page }) => {
    await page.click('#user-list');
    await page.click('#delete-user-1');
    await page.click('#confirm-delete');
    
    await expect(page.locator('#user-1')).toBeHidden();
  });
});
2. Fixtures (Custom setup)
// fixtures/database.ts
import { test as base } from '@playwright/test';

type DatabaseFixture = {
  database: {
    cleanup: () => Promise<void>;
    seedUsers: () => Promise<void>;
  };
};

export const test = base.extend<DatabaseFixture>({
  database: async ({}, use) => {
    const database = {
      cleanup: async () => {
        // Database cleanup logic
        console.log('Cleaning up database...');
      },
      seedUsers: async () => {
        // Seed database with test data
        console.log('Seeding users...');
      },
    };

    await database.seedUsers();
    await use(database);
    await database.cleanup();
  },
});

// Sử dụng fixture
test('test with database', async ({ page, database }) => {
  await page.goto('/users');
  
  // Database đã được seed với test data
  await expect(page.locator('.user-item')).toHaveCount(5);
});
Debugging
1. Debug mode
# Chạy test với debug mode
npx playwright test --debug

# Debug specific test
npx playwright test tests/example.spec.ts --debug

# Chạy với headed browser
npx playwright test --headed
2. Debug trong code
test('debug example', async ({ page }) => {
  await page.goto('https://example.com');

  // Pause execution
  await page.pause();
  
  // Console log
  console.log('Current URL:', page.url());
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'debug.png' });
  
  // Evaluate JavaScript in browser
  const title = await page.evaluate(() => document.title);
  console.log('Title:', title);
});
// Chạy Tests
// 1. Command line options
// # Chạy tất cả tests
npx playwright test

// # Chạy specific test file
npx playwright test tests/login.spec.ts

// # Chạy tests với pattern
npx playwright test --grep "login"

// # Chạy trên browser cụ thể
npx playwright test --project=chromium

// # Chạy với workers
npx playwright test --workers=4

// # Chạy failed tests
npx playwright test --last-failed

// # Generate HTML report
npx playwright test --reporter=html
// 2. CI/CD Integration
// # .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: lt
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test
      
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
// Best Practices
// 1. Test Organization
// ✅ Good - Descriptive test names
test('should display error message when login with invalid credentials', async ({ page }) => {
  // Test implementationnotepad test.md
});

// ❌ Bad - Vague test names
test('login test', async ({ page }) => {
  // Test implementation
});
2. Reliable Selectors
// ✅ Good - Use test IDs
await page.click('[data-testid="submit-button"]');

// ✅ Good - Use semantic selectors
await page.getByRole('button', { name: 'Submit' });

// ❌ Bad - Fragile CSS selectors
await page.click('div > span.btn-class > button:nth-child(2)');
3. Independent Tests
// ✅ Good - Each test is independent
test('create user', async ({ page }) => {
  // Setup data for this test
  await createTestUser();
  // Test implementation
  // Cleanup data
  await deleteTestUser();
});

// ❌ Bad - Tests depend on each other
test('create user', async ({ page }) => {
  // Creates user that next test depends on
});

test('edit user', async ({ page }) => {
  // Assumes user from previous test exists
});
4. Use Page Object Model
// ✅ Good - Centralized element management
class HomePage {
  constructor(private page: Page) {}
  
  async navigateToProducts() {
    await this.page.click('[data-testid="products-link"]');
  }
}

// ❌ Bad - Scattered element selectors
test('navigate to products', async ({ page }) => {
  await page.click('[data-testid="products-link"]');
});

test('check products page', async ({ page }) => {
  await page.click('[data-testid="products-link"]'); // Repeated selector
});
Troubleshooting
1. Common Issues
// Issue: Element not found
// Solution: Wait for element or check selector
await page.waitForSelector('[data-testid="element"]');
await page.click('[data-testid="element"]');

// Issue: Test timeout
// Solution: Increase timeout or optimize waits
test('slow test', async ({ page }) => {
  await page.goto('https://slow-site.com', { timeout: 60000 });
});

// Issue: Flaky tests
// Solution: Use proper waits instead of fixed delays
// ❌ Bad
await page.click('button');
await page.waitForTimeout(1000); // Fixed delay

// ✅ Good
await page.click('button');
await page.waitForSelector('.success-message'); // Wait for condition
2. Error Handling
test('handle errors gracefully', async ({ page }) => {
  try {
    await page.goto('https://example.com');
    await page.click('#might-not-exist', { timeout: 5000 });
  } catch (error) {
    console.log('Element not found, continuing with alternative flow');
    await page.click('#alternative-element');
  }
});
Package.json Scripts
Thêm vào package.json:

{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:chrome": "npx playwright test --project=chromium",
    "test:firefox": "npx playwright test --project=firefox",
    "test:safari": "npx playwright test --project=webkit",
    "test:mobile": "npx playwright test --project='Mobile Chrome'",
    "test:report": "npx playwright show-report",
    "test:install": "npx playwright install"
  }
}
import { test, expect } from '@playwright/test';

test('basic test example', async ({ page }) => {
  // Điều hướng đến trang
  await page.goto('https://playwright.dev/');

  // Kiểm tra title
  await expect(page).toHaveTitle(/Playwright/);

  // Click vào link
  await page.getByRole('link', { name: 'Get started' }).click();

  // Kiểm tra URL
  await expect(page).toHaveURL(/.*intro/);
});

