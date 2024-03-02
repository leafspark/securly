// Establishing connection with the Chrome runtime
var port = chrome.runtime.connect({ name: 'gmaps' });

// Storing previous URL and title
var prevUrl = document.location.href;
var prevTitle = document.title.toString();

// Getting the title element
var title = document.querySelector('title');

// Mutation observer to monitor changes in title
var observer = new MutationObserver(function (mutations) {
    mutations.some(function (mutation) {
        var newTextContent = mutation.target.textContent.toString();
        newTextContent = newTextContent.replace(/^\([0-9]{0,}\)\s/, '').replace(/ +/g, ' ');

        // Checking if the title has changed
        if (newTextContent != prevTitle) {
            prevTitle = newTextContent;
            fetchURL();
            return true;
        }
    });
});

// Function to send data to the Chrome runtime
function sendData(url) {
    // Checking if the URL has changed
    if (url != prevUrl) {
        prevUrl = document.location.href;
        port.postMessage({
            action: 'MapsURL',
            url: url,
        });
    }
}

// Function to fetch URL after a delay
async function fetchURL() {
    await sleep(2000); // Delay for 2000 milliseconds (2 seconds)
    sendData(document.location.href);
}

// Function to introduce a delay using Promises
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Observing changes in the title element
observer.observe(title, {
    subtree: false,
    characterData: true,
    childList: true,
});

