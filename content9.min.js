// Establish connection with Chrome runtime
var port = chrome.runtime.connect({ name: 'rproxport' });

// Function to be executed when window loads
async function onWindowLoad() {
    // Find main script URL
    let mainScriptUrl = findMainScriptUrl();

    // Check if main script URL is found
    if (mainScriptUrl !== '') {
        // Fetch main script content
        let response = await fetch(mainScriptUrl);
        let text = await response.text();

        // Check if main script content is valid
        if (
            '9c6d270f3803b30049faad6927e9b0cd3c6325b3a00ec8a20303049f386add4b' ==
            (await sha256(text)) ||
            text.includes('M 21 13 h -8 v 8 h -3 v -8 H 2 v -3 h 8 V 2 h 3 v 8 h 8 Z')
        ) {
            // Send data to port
            sendData(window.location.href);
        }
    } else {
        // Check if certain input placeholder is found
        let inputPlaceholder = findInputPlaceholder();
        if (
            inputPlaceholder ===
            "click on 'Create new session ID' or 'Fill in existing session ID' from below"
        ) {
            // Send data to port
            sendData(window.location.href);
        }
    }
}

// Function to find main script URL
function findMainScriptUrl() {
    let snapshot = document.evaluate(
        '//script',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    let mainScriptUrl = '';
    let scriptPattern = /\/static\/js\/main\.[0-9a-z]{1,}\.js/i;

    for (let i = 0; i < snapshot.snapshotLength; i++) {
        let item = snapshot.snapshotItem(i);
        if (
            item.attributes.length > 0 &&
            item.attributes.src !== null &&
            item.attributes.src.value.match(scriptPattern) !== null
        ) {
            mainScriptUrl = item.attributes.src.value;
            break;
        }
    }

    return mainScriptUrl;
}

// Function to calculate SHA-256 hash
async function sha256(input) {
    const encodedInput = new TextEncoder().encode(input);
    const hash = await window.crypto.subtle.digest('SHA-256', encodedInput);
    return Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

// Function to send data to port
function sendData(url) {
    port.postMessage({
        action: 'rprox',
        data: { url: url },
    });
}

// Function to call onWindowLoad with timeout
function callWindowLoadWithTimeout() {
    setTimeout(onWindowLoad, 2000);
}

// Add event listener for window load
if (window.addEventListener) {
    window.addEventListener('load', callWindowLoadWithTimeout, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', callWindowLoadWithTimeout);
}
