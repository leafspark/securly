// Connect to Chrome runtime
var sepPort = chrome.runtime.connect({ name: 'search_engine_parser' });

// Array to store search engine parser content
let shContent = [];

// Function to be executed when window loads
function sepOnWindowLoad() {
    let titleElement = document.querySelector('title');

    // Check if title element exists
    if (titleElement) {
        if (document.location.hostname.includes('youtube')) {
            var prevTitle = document.title.toString();
            new MutationObserver(function (mutations) {
                mutations.some(function (mutation) {
                    var newText = mutation.target.textContent.toString();
                    newText = newText.replace(/^\([0-9]{0,}\)\s/, '').replace(/ +/g, ' ');
                    if (newText !== prevTitle && document.URL.includes('results?search_query')) {
                        searchFlaggedData(newText);
                        prevTitle = newText;
                    }
                });
            }).observe(titleElement, {
                subtree: true,
                characterData: true,
                childList: true,
            });
        }
        sepCheckTitle(titleElement);
    } else {
        setTimeout(bingIssueFix, 2000);
    }
}

// Function to fix Bing search issue
function bingIssueFix() {
    if (document.location.hostname.includes('bing')) {
        let searchInput = document.querySelector('input[type=search]');
        if (searchInput && searchInput.value !== '') {
            searchFlaggedData(searchInput.value + ' - bing');
        }
    }
}

// Function to check and clean title element
function sepCheckTitle(titleElement) {
    if (!titleElement || !titleElement.text || titleElement.text === '') {
        return;
    }
    let titleText = titleElement.text;
    if (document.location.hostname.includes('youtube')) {
        let pattern = /^\([0-9]{0,}\)\s/;
        titleText = titleText.replace(pattern, '').replace(/ +/g, ' ');
    } else if (document.location.hostname.includes('bing')) {
        titleText = titleText.toLowerCase().replace(' - search', ' - bing');
    }
    searchFlaggedData(titleText);
}

// Function to search flagged data
function searchFlaggedData(text) {
    let dataSent = false;
    for (let i = 0; i < shContent.length; i++) {
        if (text.toLowerCase().includes('google')) {
            let tawDiv = document.querySelector('div#taw');
            if (tawDiv) {
                let indexStr = tawDiv.innerHTML.toLowerCase().indexOf(shContent[i].toLowerCase());
                if (indexStr !== -1) {
                    let aTags = Array.from(tawDiv.getElementsByTagName('a'));
                    let firstHref = aTags.length > 0 ? aTags[0].href : '';
                    if (!dataSent) {
                        sendSHData(text.toLowerCase().replace('- google search', '').trim(), firstHref, shContent[i], sepCleanDomainName(document.domain));
                        dataSent = true;
                    }
                }
            }
        } else if (text.toLowerCase().includes('bing')) {
            let bAns = document.querySelector('li.b_ans.b_top');
            if (bAns) {
                let indexStr = bAns.innerHTML.toLowerCase().indexOf(shContent[i].toLowerCase());
                if (indexStr !== -1) {
                    let aTags = Array.from(bAns.getElementsByTagName('a'));
                    let firstHref = aTags.length > 0 ? aTags[0].href : '';
                    if (!dataSent) {
                        sendSHData(text.toLowerCase().replace('- bing', '').trim(), firstHref, shContent[i], sepCleanDomainName(document.domain));
                        dataSent = true;
                    }
                }
            }
        } else if (text.toLowerCase().includes('yahoo search')) {
            let resultsDiv = document.querySelector('div#results div#main li.first');
            if (resultsDiv) {
                let indexStr = resultsDiv.innerHTML.toLowerCase().indexOf(shContent[i].toLowerCase());
                if (indexStr !== -1) {
                    let aTags = Array.from(resultsDiv.getElementsByTagName('a'));
                    let firstHref = aTags.length > 0 ? aTags[0].href : '';
                    if (!dataSent) {
                        sendSHData(text.toLowerCase().replace('- yahoo search results', '').trim(), firstHref, shContent[i], sepCleanDomainName(document.domain));
                        dataSent = true;
                    }
                }
            }
        } else if (text.toLowerCase().includes('- youtube')) {
            let emergencyOnebox = document.querySelector('ytd-emergency-onebox-renderer');
            if (emergencyOnebox) {
                let indexStr = emergencyOnebox.innerHTML.toLowerCase().indexOf(shContent[i].toLowerCase());
                if (indexStr !== -1) {
                    let aTags = Array.from(emergencyOnebox.getElementsByTagName('a'));
                    let firstHref = aTags.length > 0 ? aTags[0].href : '';
                    if (!dataSent) {
                        sendSHData(text.toLowerCase().replace('- youtube', '').trim(), firstHref, shContent[i], sepCleanDomainName(document.domain));
                        dataSent = true;
                    }
                }
            }
        }
        if (dataSent) {
            break;
        }
    }
}

// Function to send data via port
function sepSendData() {
    sepPort.postMessage({ action: 'fetchResult' });
}

// Function to send search engine result data
function sendSHData(msg, url, matchedTerm, domain) {
    sepPort.postMessage({
        action: 'sendSHResult',
        msg: msg,
        url: url,
        matchedTerm: matchedTerm,
        domain: domain,
    });
}

// Function to clean domain name
function sepCleanDomainName(domain) {
    return domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
}

// Function to call window load with timeout
function sepCallWindowLoadWithTimeOut() {
    sepSendData();
    setTimeout(sepOnWindowLoad, 2000);
}

// Event listener for window load
window.addEventListener ? window.addEventListener('load', sepCallWindowLoadWithTimeOut, false) : window.attachEvent && window.attachEvent('onload', sepCallWindowLoadWithTimeOut);

// Listener for messages from the port
sepPort.onMessage.addListener(function (message) {
    shContent = message;
});
