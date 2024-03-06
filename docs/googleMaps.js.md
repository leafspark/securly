# Google Maps URL Monitoring Extension

This code is designed to work as a content script in a Chrome extension. It establishes a connection with the Chrome runtime and monitors changes in the URL and title of a Google Maps page. It sends the updated URL to the Chrome runtime whenever a change is detected.

## Code Overview

```javascript
// Establishing connection with the Chrome runtime
var port = chrome.runtime.connect({ name: 'gmaps' });

// Storing previous URL and title
var prevUrl = document.location.href;
var prevTitle = document.title.toString();

// Getting the title element
var title = document.querySelector('title');

// Mutation observer to monitor changes in the title element
var observer = new MutationObserver(function (mutations) {
    // ...
});

// Function to send data to the Chrome runtime
function sendData(url) {
    // ...
}

// Function to fetch the URL after a delay
async function fetchURL() {
    // ...
}

// Function to introduce a delay using Promises
function sleep(milliseconds) {
    // ...
}

// Observing changes in the title element
observer.observe(title, {
    subtree: false,
    characterData: true,
    childList: true,
});
```

## Functionality

### Establishing Connection with Chrome Runtime
The code establishes a connection with the Chrome runtime using `chrome.runtime.connect()` with the name `'gmaps'`. This connection is used to send messages to the Chrome runtime.

### Monitoring URL and Title Changes
The code uses a MutationObserver to monitor changes in the title element of the Google Maps page. Whenever a change is detected, it checks if the title has changed by comparing it with the previous title. If a change is detected, it triggers the `fetchURL` function.

### Fetching URL with Delay
The `fetchURL` function introduces a delay of 2 seconds using the `sleep` function, which returns a Promise that resolves after the specified delay. After the delay, it calls the `sendData` function with the current URL.

### Sending Data to Chrome Runtime
The `sendData` function checks if the URL has changed by comparing it with the previous URL. If a change is detected, it sends the updated URL to the Chrome runtime using `port.postMessage()`.

## Functions

### `sendData(url)`
- Description: Sends data to the Chrome runtime if the URL has changed.
- Parameters:
  - `url` (string): The URL to be sent to the Chrome runtime.

### `fetchURL()`
- Description: Fetches the URL after a delay of 2 seconds using the `sleep` function.
- Returns: A Promise that resolves after the delay and sends the URL to the Chrome runtime.

### `sleep(milliseconds)`
- Description: Introduces a delay using Promises.
- Parameters:
  - `milliseconds` (number): The number of milliseconds to delay.
- Returns: A Promise that resolves after the specified delay.

## Mutation Observer
The code uses a MutationObserver to observe changes in the title element. It is configured to monitor changes in the text content and child nodes of the title element. Whenever a change is detected, it triggers the callback function to check if the title has changed and performs the necessary actions.