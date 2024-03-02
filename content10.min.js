// Establish connection with Chrome runtime
var port = chrome.runtime.connect({ name: 'proxyDetection' });

// Initialize variables
let triggeredIdentification = false;
let proxyConfig;

// Function to identify proxies when window loads
async function onWindowLoad() {
    port.postMessage({ action: 'identifyProxy' });
}

// Function to identify proxy based on specific conditions
function identifyProxy(proxyConfig) {
    if (proxyConfig.featureFlag && !document.location.origin.includes('securly.com')) {
        executeScriptWithInterval(() => findProxy(document, proxyConfig), 7, 3000);
        executeScriptWithInterval(() => identifyProxyByContent(document, proxyConfig), 5, 2000);
    }
}

// Function to find proxy based on elements on the webpage
function findProxy(document, proxyConfig) {
    const proxyData = proxyConfig.proxyData;
    for (const data of proxyData) {
        let found = true;
        for (const target of data.targetElements) {
            const element = document.querySelector(target.target);
            if (!element || (target.content && element.textContent !== target.content)) {
                found = false;
                break;
            }
        }
        if (found) {
            return data;
        }
    }
}

// Listen for messages from Chrome runtime
port.onMessage.addListener(function (message) {
    proxyConfig = message.proxyConfig;
    if (!triggeredIdentification) {
        triggeredIdentification = true;
        identifyProxy(message.proxyConfig);
    }
});

// Function to identify proxy based on specific content
const identifyProxyByContent = (document, proxyConfig) => {
    if (!proxyConfig.targetSiteContent.targetElements) {
        return;
    }
    const targetElements = proxyConfig.targetSiteContent.targetElements;
    return scanDocumentForProxy(targetElements, document);
};

// Function to scan document for proxy based on rules
const scanDocumentForProxy = (targetElements, document) => {
    if (targetElements && document) {
        for (const target of targetElements) {
            let found = true;
            for (const rule of target.rules) {
                const element = document.querySelector(rule.targetElement);
                if (!element || (rule.value && element[rule.keyName] !== rule.value)) {
                    found = false;
                    break;
                }
            }
            if (found && !document.location.origin.includes(target.domainName)) {
                return target;
            }
        }
    }
};

// Utility function to execute a function with a specified interval
const executeScriptWithInterval = (func, times, interval) => {
    let count = 0;
    let result;
    const intervalId = setInterval(() => {
        if (result) {
            clearInterval(intervalId);
            chrome.runtime.sendMessage({
                type: 'proxyIdentified',
                proxyUrl: document.location.origin,
                ...result
            }, function () { });
        }
        if (count >= times) {
            clearInterval(intervalId);
        } else {
            count++;
            result = func();
        }
    }, interval);
};

// Add event listener for window load
if (window.addEventListener) {
    window.addEventListener('load', onWindowLoad, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', onWindowLoad);
}
