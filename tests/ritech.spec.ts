import { test, expect } from "@playwright/test";
import path from "path";

test("File Upload", async ({ page, browserName }) => {
  // Using multiple file formats to check if any format is rejected

  // Increased timeout to 60 seconds for wekbit as I experienced some flakyness with 7 sequential uploads
  if (browserName === "webkit") {
    test.setTimeout(60000);
  }

  const filesToUpload = [
        { path: path.join(__dirname, 'test-files/Example Photos/jpg500kb.jpg'), name: 'jpg500kb.jpg' },
        { path: path.join(__dirname, 'test-files/Example Photos/png500kb.png'), name: 'png500kb.png' },
        { path: path.join(__dirname, 'test-files/Example Documents/file_example_XLS_100.xls'), name: 'file_example_XLS_100.xls' },
        { path: path.join(__dirname, 'test-files/Example Documents/file_example_XLSX_100.xlsx'), name: 'file_example_XLSX_100.xlsx' },
        { path: path.join(__dirname, 'test-files/Example Documents/file-sample_150kB.pdf'), name: 'file-sample_150kB.pdf' },
        { path: path.join(__dirname, 'test-files/Example Documents/file-sample_500kB.doc'), name: 'file-sample_500kB.doc' },
        { path: path.join(__dirname, 'test-files/Example Documents/file-sample_500kB.docx'), name: 'file-sample_500kB.docx' }
  ];

  for (const file of filesToUpload) {

    // Navigation
    await page.goto("https://the-internet.herokuapp.com/upload");

    // Uploading
    const fileInput = page.locator("#file-upload");
    await fileInput.setInputFiles(file.path);
    await page.locator("#file-submit").click();

    // Validation
    const successMessage = page.locator("#uploaded-files");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(file.name);

    // Easier to debug in the event that a format fails to upload
    console.log(`Successfully uploaded: ${file.name}`);
  }
});

test("Drag and Drop", async ({ page }) => {

  // Navigation
  await page.goto("https://the-internet.herokuapp.com/drag_and_drop");

  // Locate & initial state
  const columnA = page.locator("#column-a");
  const columnB = page.locator("#column-b");
  await expect(columnA).toContainText("A");
  await expect(columnB).toContainText("B");

  // Drag & Drop action - using JS for webkit based browser compatibility
  await page.evaluate(() => {
    const columnA = document.querySelector("#column-a") as HTMLElement;
    const columnB = document.querySelector("#column-b") as HTMLElement;

    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dragStartEvent.dataTransfer,
    });

    const dragEndEvent = new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dragStartEvent.dataTransfer,
    });

    columnA.dispatchEvent(dragStartEvent);
    columnB.dispatchEvent(dropEvent);
    columnA.dispatchEvent(dragEndEvent);
  });

  // Validation
  await expect(columnA).toContainText("B");
  await expect(columnB).toContainText("A");

  // Return to initial state and validate
  await page.evaluate(() => {
    const columnA = document.querySelector("#column-a") as HTMLElement;
    const columnB = document.querySelector("#column-b") as HTMLElement;

    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dragStartEvent.dataTransfer,
    });

    const dragEndEvent = new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dragStartEvent.dataTransfer,
    });

    columnB.dispatchEvent(dragStartEvent);
    columnA.dispatchEvent(dropEvent);
    columnB.dispatchEvent(dragEndEvent);
  });

  await expect(columnA).toContainText("A");
  await expect(columnB).toContainText("B");
});

test("JavaScript Alerts", async ({ page }) => {

  // Navigation
  await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

  const resultMessage = page.locator("#result");

  // JS Alert
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("I am a JS Alert");
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Click for JS Alert" }).click();
  await expect(resultMessage).toContainText(
    "You successfully clicked an alert"
  );

  // JS Confirm - click OK
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("I am a JS Confirm");
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Click for JS Confirm" }).click();
  await expect(resultMessage).toContainText("You clicked: Ok");

  // JS Confirm - click Cancel
  page.once("dialog", async (dialog) => {
    await dialog.dismiss();
  });

  await page.getByRole("button", { name: "Click for JS Confirm" }).click();
  await expect(resultMessage).toContainText("You clicked: Cancel");

  // JS Prompt - Entering text and clicking OK
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe("I am a JS prompt");
    await dialog.accept("Input test");
  });

  await page.getByRole("button", { name: "Click for JS Prompt" }).click();
  await expect(resultMessage).toContainText("You entered: Input test");

  // JS Prompt - Clicking Cancel
  page.once("dialog", async (dialog) => {
    await dialog.dismiss();
  });

  await page.getByRole("button", { name: "Click for JS Prompt" }).click();
  await expect(resultMessage).toContainText("You entered: null");
});

test("New Window Handle / New Tab", async ({ page, context }) => {

  // Navigation
  await page.goto("https://the-internet.herokuapp.com/windows");

  // Listener setup and new tab action
  const newWindowPromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "Click Here" }).click();
  const newWindow = await newWindowPromise;
  await newWindow.waitForLoadState();

  // Validation
  await expect(newWindow.locator("h3")).toContainText("New Window");

  // Return to initial tab and close new tab
  await page.bringToFront();
  await newWindow.close();
});

test("Hover Functionality", async ({ page }) => {
  // Added some extra checks in regards to the functionality of the "View profile" button
  // This test can be made to be more dynamic in the event of new users being added on
  // For this scenario it is taken into consideration that we're testing a predifined data set

  // Navigation
  await page.goto("https://the-internet.herokuapp.com/hovers");

  // Defining
  const profiles = [
    { image: page.locator('.figure').nth(0), expectedName: 'name: user1', userId: '1' },
    { image: page.locator('.figure').nth(1), expectedName: 'name: user2', userId: '2' },
    { image: page.locator('.figure').nth(2), expectedName: 'name: user3', userId: '3' }
  ];

  // Hover & Validation
  for (const profile of profiles) {
    await profile.image.hover();

    const caption = profile.image.locator(".figcaption");
    await expect(caption).toBeVisible();
    await expect(caption).toContainText(profile.expectedName);

    const viewProfileLink = profile.image.locator("a");
    await expect(viewProfileLink).toBeVisible();
    await expect(viewProfileLink).toContainText("View profile");

    // Validate the "View profile" button leads to the correct user
    const href = await viewProfileLink.getAttribute("href");
    expect(href).toBe(`/users/${profile.userId}`);
  }
});

test("Checkboxes", async ({ page }) => {
  // I used both checkboxes in this test to validate both checked & unchecked state of the two

  // Navigation
  await page.goto("https://the-internet.herokuapp.com/checkboxes");

  // Locate & check current state
  const checkbox1 = page.locator('input[type="checkbox"]').nth(0);
  const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

  const checkbox1InitialState = await checkbox1.isChecked();
  const checkbox2InitialState = await checkbox2.isChecked();

  // Check both & validate
  if (!checkbox1InitialState) {
    await checkbox1.check();
  }
  if (!checkbox2InitialState) {
    await checkbox2.check();
  }

  await expect(checkbox1).toBeChecked();
  await expect(checkbox2).toBeChecked();

  // Uncheck both & validate
  await checkbox1.uncheck();
  await checkbox2.uncheck();

  await expect(checkbox1).not.toBeChecked();
  await expect(checkbox2).not.toBeChecked();
});
