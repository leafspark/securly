# File: content9.min.js

## Description
This JavaScript file is likely part of a Chrome extension or browser script designed to perform certain actions when the window loads. It fetches and analyzes the main script of the webpage and sends data to a specified port based on certain conditions.

## Functions
1. **onWindowLoad():**
   - Function executed when the window loads.
   - Finds the URL of the main script and sends data to a port based on certain conditions.

2. **findMainScriptUrl():**
   - Finds the URL of the main script by searching through script elements in the document.

3. **sha256(input):**
   - Calculates the SHA-256 hash of the input string.

4. **sendData(url):**
   - Sends data to the specified port with the URL as part of the payload.

5. **callWindowLoadWithTimeout():**
   - Calls the `onWindowLoad()` function with a timeout of 2000 milliseconds.

## Event Listeners
- `'load'` event listener attached to the window:
  - Calls the `callWindowLoadWithTimeout()` function when the window loads.

## Dependencies
- Chrome runtime:
  - This script relies on the Chrome runtime to establish a connection and send messages to a specified port.

## Usage
This script is typically included as part of a Chrome extension or browser script designed to perform actions when the window loads. It fetches the main script of the webpage, analyzes its content, and sends data to a port if certain conditions are met.
