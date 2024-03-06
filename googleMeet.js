// Function to be executed when window loads
function onWindowLoad() {
    if (document.title.toString().includes('Meet - ')) {
        // Connect to Chrome runtime and send message with Google Meet URL
        chrome.runtime.connect({ name: 'gmeet' }).postMessage({
            action: 'getGoogleMeetUrl',
            url: window.location.href,
        });
    }
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
