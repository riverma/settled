import { test, expect, type Page } from '@playwright/test';

const Q = 'Should I go to the gym tomorrow?';

/** Tap the one *visible* button with this exact label (hidden sheets share labels). */
async function tap(page: Page, label: string): Promise<void> {
  await page
    .getByRole('button', { name: label, exact: true })
    .filter({ visible: true })
    .first()
    .click();
}

test('decide and move on: a quick call end to end', async ({ page }) => {
  await page.goto('/?demo');

  // home: decision rows render
  await expect(page.locator('.dec-row')).toHaveCount(3);
  await expect(page.getByText('Where to get lunch?')).toBeVisible();

  // new decision: question + two options
  await tap(page, 'New decision');
  await page.fill('#f-question', Q);
  await tap(page, 'Add an option');
  await tap(page, 'Add an option');
  await page.locator('.opt-row input').nth(0).fill('Go in the morning');
  await page.locator('.opt-row input').nth(1).fill('Go after work');
  await tap(page, 'Continue');

  // stakes, a little, the engine suggests Good enough
  await expect(page.getByText('How much does this one matter?')).toBeVisible();
  await page.locator('[data-stakes="a-little"]').click();
  await tap(page, 'Continue');
  await expect(page.getByText('What would good enough look like?')).toBeVisible();

  // set the bar, check options, first yes wins
  await page.locator('textarea').filter({ visible: true }).fill('Any sweat counts');
  await tap(page, 'Continue');
  await expect(page.getByText('Does it clear the bar?')).toBeVisible();
  await page.getByRole('button', { name: 'No', exact: true }).filter({ visible: true }).first().click();
  await page.getByRole('button', { name: 'Yes', exact: true }).filter({ visible: true }).first().click();
  await expect(page.getByText('Then take it.')).toBeVisible();
  await tap(page, 'Continue');

  // make it real: the close
  await expect(page.getByText('Make it real')).toBeVisible();
  await page.fill('#r-sentence', 'I will go to the gym in the morning.');
  await page.fill('#r-step', 'Set the alarm.');
  await page.fill('#r-when', 'Tonight');
  await tap(page, 'Save the decision');

  // back home, decided row shows the sentence
  await expect(page.locator('.dec-row')).toHaveCount(4);
  await expect(page.getByText('I will go to the gym in the morning.')).toBeVisible();
});

test('stop for now keeps a draft', async ({ page }) => {
  await page.goto('/?demo');
  await tap(page, 'New decision');
  await page.fill('#f-question', 'Should I start a course?');
  await tap(page, 'Continue');
  await page.locator('[data-stakes="a-little"]').click();
  await tap(page, 'Continue');
  await expect(page.getByText('Step 1 of 2')).toBeVisible();
  await tap(page, 'Stop for now');
  await expect(page.getByText('Should I start a course?')).toBeVisible();
  await expect(page.getByText(/In progress/)).toBeVisible();
});

test('the big binary decision goes to Look ahead', async ({ page }) => {
  await page.goto('/?demo');
  await tap(page, 'New decision');
  await page.fill('#f-question', 'Should I leave my job?');
  await tap(page, 'No options yet');
  await tap(page, 'Continue');
  await page.locator('[data-stakes="a-lot"]').click();
  await tap(page, 'Continue');
  await expect(page.getByText('In ten minutes')).toBeVisible();
  await page.locator('textarea').filter({ visible: true }).first().fill('Relieved, a bit scared.');
  await tap(page, 'Continue');
  await expect(page.getByText('In ten months')).toBeVisible();
});

test('export produces plain YAML the app can re-import', async ({ page }) => {
  await page.goto('/?demo');
  await page.locator('.dec-row').first().click();
  await expect(page.getByText('The decision', { exact: true }).filter({ visible: true })).toBeVisible();
  await tap(page, 'Export');
  await expect(page.locator('#exp-yaml')).toContainText('settled: "1.0"');
  await expect(page.locator('#exp-yaml')).toContainText('decisions:');
  await tap(page, 'Done');
});