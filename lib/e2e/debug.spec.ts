import { test, expect } from '@playwright/test';

test('Debug: Seite prüfen', async ({ page }) => {
  await page.goto('/');
  
  // Warte auf die Seite
  await page.waitForLoadState('networkidle');
  
  // Screenshot machen
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  
  // HTML-Inhalt ausgeben
  const html = await page.content();
  console.log('HTML Content:', html.substring(0, 1000));
  
  // Alle Buttons finden
  const buttons = await page.locator('button').all();
  console.log('Anzahl Buttons:', buttons.length);
  
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    console.log(`Button ${i}:`, text);
  }
  
  // Alle Texte auf der Seite
  const bodyText = await page.locator('body').textContent();
  console.log('Body Text:', bodyText?.substring(0, 500));
});

