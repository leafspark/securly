# File: googleMeet.js

## Description
This JavaScript file appears to be part of a Chrome extension or browser script designed to perform actions when the window loads. It checks if the title of the document contains 'Meet - ', and if so, it connects to the Chrome runtime and sends a message with the URL of the Google Meet page.

## Functions
1. **onWindowLoad():**
   - Function executed when the window loads.
   - It checks if the title of the document contains 'Meet - ' and sends a message with the Google Meet URL to the Chrome runtime.

2. **callWindowLoadWithTimeout():**
   - Function to call `onWindowLoad()` with a timeout of 2000 milliseconds.

## Event Listeners
- `'load'` event listener attached to the window:
  - Calls the `callWindowLoadWithTimeout()` function when the window loads.

## Dependencies
- Chrome runtime:
  - This script relies on the Chrome runtime to connect and communicate with the extension or browser environment.

## Usage
This script is typically included as part of a Chrome extension or browser script designed to perform actions when the window loads, specifically for Google Meet-related pages.
