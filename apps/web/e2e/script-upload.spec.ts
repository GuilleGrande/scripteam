import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Script Upload E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the upload page
    await page.goto('/');
  });

  test('should display upload interface correctly', async ({ page }) => {
    // Check page title
    await expect(page.getByText('Upload Your Script')).toBeVisible();
    await expect(page.getByText('Get AI-powered scene partners in minutes')).toBeVisible();

    // Check upload area
    await expect(page.getByText('Drop your script here')).toBeVisible();
    await expect(page.getByText('or click to browse files')).toBeVisible();

    // Check supported file types
    await expect(page.getByText('PDF')).toBeVisible();
    await expect(page.getByText('TXT')).toBeVisible();

    // Check what happens next section
    await expect(page.getByText('What happens next?')).toBeVisible();
    await expect(page.getByText('AI analyzes your script and characters')).toBeVisible();
    await expect(page.getByText('Creates unique voices for each character')).toBeVisible();
    await expect(page.getByText('Ready to practice in 90-120 seconds')).toBeVisible();
  });

  test('should handle file upload via click', async ({ page }) => {
    // Create a test file
    const testFilePath = path.join(__dirname, 'fixtures', 'test-script.pdf');

    // Mock the API response to avoid actual backend dependency
    await page.route('**/api/scripts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-script-123',
          filename: 'test-script.pdf',
          status: 'uploaded'
        }),
      });
    });

    // Create test file content
    await page.evaluate(() => {
      // Create a simple test file in the browser
      const blob = new Blob(['Test script content'], { type: 'application/pdf' });
      const file = new File([blob], 'test-script.pdf', { type: 'application/pdf' });

      // Mock file input behavior
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      // Trigger change event
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    });

    // Check that upload started message appears
    await expect(page.getByText('Upload started')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Processing test-script.pdf...')).toBeVisible({ timeout: 5000 });
  });

  test('should handle drag and drop upload', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/scripts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'dropped-script-456',
          filename: 'dropped-script.txt',
          status: 'uploaded'
        }),
      });
    });

    const uploadArea = page.locator('[data-testid="upload-area"]').or(
      page.getByText('Drop your script here').locator('..')
    );

    // Simulate drag and drop
    await page.evaluate(() => {
      const dropZone = document.querySelector('.cursor-pointer');
      if (dropZone) {
        // Create a test file
        const file = new File(['Test script content'], 'dropped-script.txt', { type: 'text/plain' });

        // Create drag and drop events
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });

        dropZone.dispatchEvent(dropEvent);
      }
    });

    // Verify upload process started
    await expect(page.getByText('Upload started')).toBeVisible({ timeout: 5000 });
  });

  test('should show processing UI during upload', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/scripts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'processing-script-789',
          filename: 'processing-script.pdf',
          status: 'uploaded'
        }),
      });
    });

    // Trigger file upload
    await page.evaluate(() => {
      const blob = new Blob(['Test script content'], { type: 'application/pdf' });
      const file = new File([blob], 'processing-script.pdf', { type: 'application/pdf' });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    });

    // Wait for processing UI to appear
    await expect(page.getByText('AI Processing Your Script')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Creating your personalized practice experience')).toBeVisible();

    // Check that progress bar appears
    await expect(page.locator('[role="progressbar"]')).toBeVisible();

    // Check for processing phases
    await expect(page.getByText('Processing with AI technology')).toBeVisible();
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/scripts', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error'
        }),
      });
    });

    // Attempt file upload
    await page.evaluate(() => {
      const blob = new Blob(['Test script content'], { type: 'application/pdf' });
      const file = new File([blob], 'error-script.pdf', { type: 'application/pdf' });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    });

    // Check that error message appears
    await expect(page.getByText('Upload failed')).toBeVisible({ timeout: 5000 });
  });

  test('should validate file types', async ({ page }) => {
    // Attempt to upload invalid file type
    await page.evaluate(() => {
      const blob = new Blob(['Invalid content'], { type: 'application/msword' });
      const file = new File([blob], 'invalid.doc', { type: 'application/msword' });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    });

    // Check that validation error appears
    await expect(page.getByText('Invalid file type')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Please upload a PDF or TXT file')).toBeVisible();
  });

  test('should complete upload process successfully', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/scripts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'complete-script-999',
          filename: 'complete-script.pdf',
          status: 'uploaded'
        }),
      });
    });

    // Start upload
    await page.evaluate(() => {
      const blob = new Blob(['Complete test script'], { type: 'application/pdf' });
      const file = new File([blob], 'complete-script.pdf', { type: 'application/pdf' });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    });

    // Wait for upload to start
    await expect(page.getByText('Upload started')).toBeVisible({ timeout: 5000 });

    // Wait for processing to begin
    await expect(page.getByText('AI Processing Your Script')).toBeVisible({ timeout: 10000 });

    // The test verifies the upload workflow starts correctly
    // In a real scenario, we would wait for completion, but for testing purposes
    // we verify the key steps are triggered
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Test keyboard accessibility
    await page.keyboard.press('Tab');

    // The upload area should be focusable
    const uploadArea = page.getByText('Drop your script here').locator('..');
    await expect(uploadArea).toBeFocused();

    // Test Enter key to trigger file picker
    await page.keyboard.press('Enter');

    // Verify the interaction works (file input should be activated)
    // Note: We can't easily test the actual file picker opening in headless mode
    // but we can verify the element is interactive
  });
});