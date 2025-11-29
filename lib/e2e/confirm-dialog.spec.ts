import { test, expect } from '@playwright/test';

test.describe('Confirm Dialog', () => {
  test('sollte einen Dialog mit Tabelle anzeigen, wenn der Confirm-Button geklickt wird', async ({ page }) => {
    // Console-Logs abfangen
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.log('Page error:', error.message));

    // Seite öffnen
    await page.goto('/');

    // Warten, bis die Seite geladen ist
    await page.waitForLoadState('domcontentloaded');
    
    // Warten auf Button (mit längerem Timeout)
    const button = page.getByText('Open da Confirm', { exact: false }).or(page.locator('button').filter({ hasText: /Open da Confirm/i }));
    await expect(button.first()).toBeVisible({ timeout: 15000 });

    // Prüfen, dass der Dialog initial nicht sichtbar ist
    const dialog = page.locator('.p-dialog, [role="dialog"]');
    const dialogCount = await dialog.count();
    if (dialogCount > 0) {
      await expect(dialog.first()).not.toBeVisible();
    }

    // Button klicken
    await button.first().click();

    // Warten, bis der Dialog sichtbar ist
    await page.waitForSelector('.p-dialog:visible, [role="dialog"]:visible', { timeout: 5000 });
    const visibleDialog = page.locator('.p-dialog:visible, [role="dialog"]:visible').first();
    await expect(visibleDialog).toBeVisible();

    // Prüfen, dass der Dialog-Header "Daten" enthält
    await expect(page.getByText('Daten')).toBeVisible({ timeout: 5000 });

    // Prüfen, dass die Tabelle vorhanden ist
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 5000 });

    // Prüfen, dass die Tabellen-Header vorhanden sind
    await expect(page.getByRole('columnheader', { name: 'Id' }).or(page.locator('th').filter({ hasText: 'Id' }))).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' }).or(page.locator('th').filter({ hasText: 'Name' }))).toBeVisible();

    // Prüfen, dass Tabellenzellen vorhanden sind
    const cells = table.locator('td');
    const cellCount = await cells.count();
    expect(cellCount).toBeGreaterThan(0);
  });

  test('sollte den Dialog schließen, wenn Cancel geklickt wird', async ({ page }) => {
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.log('Page error:', error.message));
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Dialog öffnen
    const button = page.locator('button').filter({ hasText: /Open da Confirm/i }).first();
    await button.click();

    // Warten, bis Dialog sichtbar ist
    await page.waitForSelector('.p-dialog:visible, [role="dialog"]:visible', { timeout: 5000 });
    const dialog = page.locator('.p-dialog:visible, [role="dialog"]:visible').first();
    await expect(dialog).toBeVisible();

    // Cancel-Button finden und klicken
    const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(page.locator('button').filter({ hasText: 'Cancel' }));
    await expect(cancelButton.first()).toBeVisible();
    await cancelButton.first().click();

    // Prüfen, dass Dialog geschlossen ist
    await expect(dialog).not.toBeVisible({ timeout: 2000 });
  });

  test('sollte den Dialog schließen, wenn Save geklickt wird', async ({ page }) => {
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.log('Page error:', error.message));
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Dialog öffnen
    const button = page.locator('button').filter({ hasText: /Open da Confirm/i }).first();
    await button.click();

    // Warten, bis Dialog sichtbar ist
    await page.waitForSelector('.p-dialog:visible, [role="dialog"]:visible', { timeout: 5000 });
    const dialog = page.locator('.p-dialog:visible, [role="dialog"]:visible').first();
    await expect(dialog).toBeVisible();

    // Save-Button finden und klicken
    const saveButton = page.getByRole('button', { name: 'Save' }).or(page.locator('button').filter({ hasText: 'Save' }));
    await expect(saveButton.first()).toBeVisible();
    await saveButton.first().click();

    // Prüfen, dass Dialog geschlossen ist
    await expect(dialog).not.toBeVisible({ timeout: 2000 });
  });
});

