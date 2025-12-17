# Playwright Automation Test Suite

## Overview
Automated end-to-end test suite built with Playwright and TypeScript for testing web application functionality on 
[the-internet.herokuapp.com](https://the-internet.herokuapp.com/).

## Test Coverage
This suite includes 6 comprehensive test scenarios:

1. **File Upload** - Tests multiple file types (images: JPG, PNG | documents: XLS, XLSX, PDF, DOC, DOCX)
2. **Drag and Drop** - Validates bidirectional drag-and-drop functionality with cross-browser compatibility
3. **JavaScript Alerts** - Handles all dialog types (alert, confirm, prompt) with acceptance and dismissal scenarios
4. **New Window/Tab** - Tests window context switching and validation
5. **Hover Functionality** - Verifies hover interactions and dynamic content display
6. **Checkboxes** - Dynamic state checking with comprehensive validation

## Test Details

### File Upload Test
- Uploads 7 different file types sequentially
- Validates success message for each file
- Uses absolute paths for cross-platform compatibility

### Drag and Drop Test
- Tests bidirectional drag-and-drop (A→B and B→A)
- Verifies position changes after each drag
- Includes WebKit compatibility workaround

### JavaScript Alerts Test
- Tests all 3 dialog types: alert, confirm, prompt
- Tests both acceptance and dismissal scenarios
- Validates result messages after each interaction

### New Window/Tab Test
- Opens new browser context
- Switches between windows
- Validates content in new window

### Hover Functionality Test
- Tests hover interactions
- Validates dynamic content display
- Checks multiple profile elements

### Checkboxes Test
- Dynamically checks initial checkbox states
- Tests checking and unchecking operations
- Validates final states

## Known Issues & Solutions
- **WebKit Drag-and-Drop**: WebKit handles HTML5 drag-and-drop differently. Test uses JavaScript `evaluate()` to directly trigger drag events for cross-browser compatibility.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/boksaf/playwright-ritech-tests.git
cd playwright-ritech-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run specific test
```bash
npx playwright test -g "File Upload"
npx playwright test -g "Drag and Drop"
npx playwright test -g "JavaScript Alerts"
npx playwright test -g "New Window Handle / New Tab"
npx playwright test -g "Hover Functionality"
npx playwright test -g "Checkboxes"
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Results

After test execution, you can view results:

### HTML Report
```bash
npx playwright show-report
```

### Expected Output
When tests complete successfully, you should see:
```
Running 18 tests using 6 workers
18 passed (15-30s)

To open last HTML report run:
  npx playwright show-report
```

## CI/CD Integration

This project includes GitHub Actions workflow for continuous integration.

### What it does:
- Runs on every push and pull request
- Tests across Chromium, Firefox, and WebKit
- Generates and uploads test reports as artifacts
- Runs on Ubuntu latest

### Viewing CI Results
1. Go to the "Actions" tab in GitHub
2. Select the latest workflow run
3. Download test reports from artifacts

## Project Structure
```
playwright-ritech-tests/
├── tests/
│   ├── ritech.spec.ts          # Main test suite (6 test scenarios)
│   └── test-files/             # Test assets for file upload
│       ├── Example Photos/     # JPG, PNG test files
│       └── Example Documents/  # XLS, XLSX, PDF, DOC, DOCX files
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```


## Author
Bojan Fildishevski

## License
This project is for interview/assessment purposes.
