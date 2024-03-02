// Connect to Chrome runtime
const port = chrome.runtime.connect({ name: 'yt' });

// Function executed when the window loads
function onWindowLoad() {
    // Add event listener for window scroll
    window.onscroll = function () {
        onWindowScroll();
    };

    // Initialize variables
    window.youtubeLastCheck = null;
    sendOptionsRequest();

    // Check for YouTube embeds
    const hasYoutubeEmbed = document.documentElement.innerHTML.indexOf('ytp-embed') >= 0;
    if (hasYoutubeEmbed) {
        // Extract channel and video IDs
        let channelId = null;
        let videoId = null;
        const channelIdMatch = document.documentElement.innerHTML.match(/\/channel\/([a-zA-Z0-9-_]{1,})"/);
        if (channelIdMatch && channelIdMatch.length === 2) {
            channelId = channelIdMatch[1];
        }
        const videoIdMatch = document.documentElement.innerHTML.match(/\/watch\?v=([a-zA-Z0-9-_]{1,})">/);
        if (videoIdMatch && videoIdMatch.length === 2) {
            videoId = videoIdMatch[1];
        }

        // Send data if channel or video ID is present
        if (channelId || videoId) {
            sendData({
                channelId: channelId,
                videoId: videoId,
                category: null,
                embedded: hasYoutubeEmbed
            });
            return true;
        }
    }

    // Check for YouTube page content and send data accordingly
    if (document.documentElement.innerHTML.indexOf('window["ytInitialPlayerResponse"] = null') === -1) {
        sendData(fetchPageInfo(true, document.documentElement.innerHTML));
    }
    if (document.documentElement.innerHTML.indexOf('itemprop="channelId"') > -1) {
        sendData(fetchPageInfo(false));
    }

    // Observe changes in the title
    const title = document.title.toString();
    const titleObserver = new MutationObserver(function (mutations) {
        mutations.some(function (mutation) {
            const newText = mutation.target.textContent.toString().replace(/^\([0-9]{0,}\)\s/, '').replace(/ +/g, ' ');
            if (newText !== title) {
                title = newText;
                if (document.URL.indexOf('results?search_query') === -1) {
                    location.reload();
                }
                return true;
            }
        });
    });
    titleObserver.observe(document.querySelector('title'), {
        subtree: true,
        characterData: true,
        childList: true
    });

    // Observe changes in ytd-browse
    const ytdBrowse = document.querySelector('ytd-browse');
    if (ytdBrowse !== null) {
        window.ytdBrowse = ytdBrowse;
        window.lastUpdateBrowse = null;
        const browseObserver = new MutationObserver(function (mutations) {
            mutations.some(function () {
                if (window.lastUpdateBrowse === null || (Math.floor(Date.now() / 1000) - window.lastUpdateBrowse) > 5) {
                    window.lastUpdateBrowse = Math.floor(Date.now() / 1000);
                    sendData(fetchPageInfo(false));
                    processActions(window.lastResponse);
                    return true;
                }
            });
        });
        browseObserver.observe(ytdBrowse, {
            subtree: true,
            characterData: true,
            childList: true
        });
    }
}

// Fetch page information
function fetchPageInfo(embedded, html = '') {
    if (embedded) {
        const startIndex = html.indexOf('var ytInitialPlayerResponse = ') + 30;
        const endIndex = html.indexOf('};', startIndex) + 1 - startIndex;
        let channelId = null;
        let videoId = null;
        let category = null;
        try {
            const jsonData = JSON.parse(html.substr(startIndex, endIndex));
            channelId = jsonData.videoDetails.channelId;
            videoId = jsonData.videoDetails.videoId;
            category = jsonData.microformat.playerMicroformatRenderer.category;
        } catch (error) { }
        return {
            channelId: channelId,
            videoId: videoId,
            category: category,
            embedded: true
        };
    } else if (!embedded && document.querySelector("meta[itemprop='channelId']") !== null) {
        const channelId = document.querySelector("meta[itemprop='channelId']").getAttribute('content');
        return {
            channelId: channelId,
            videoId: null,
            category: null,
            embedded: html.indexOf('ytp-embed') >= 0
        };
    }
}

// Send data to Chrome runtime
function sendData(data) {
    port.postMessage({
        action: 'getSourceYoutube',
        channelId: data.channelId,
        videoId: data.videoId,
        category: data.category,
        embedded: data.embedded
    });
}

// Send options request to Chrome runtime
function sendOptionsRequest() {
    port.postMessage({ action: 'getYoutubeOptions' });
}

// Process actions based on response from Chrome runtime
function processActions(response) {
    if (window.lastResponse !== response) {
        window.lastResponse = response;
    }
    if (response.hideComments) {
        hideComment();
    }
    if (response.hideThumbnails) {
        hideThumbnails();
    }
    if (response.hideSidebar) {
        hideSidebar();
    }
    if (response.hideRecommended) {
        hideRecommended();
    }
    if (response.action !== undefined && response.action === 'deny') {
        self.location = response.url;
    }
}

// Hide comments section
function hideComment() {
    const comments = document.querySelector('ytd-comments');
    if (comments !== null) {
        comments.remove();
    }
}

// Hide thumbnails
function hideThumbnails() {
    [...document.querySelectorAll('ytd-thumbnail')].forEach((thumbnail) => {
        thumbnail.remove();
    });
    [...document.querySelectorAll('ytd-playlist-thumbnail')].forEach((playlistThumbnail) => {
        playlistThumbnail.remove();
    });
}

// Hide sidebar
function hideSidebar() {
    const related = document.querySelector("div[id='related']");
    if (related !== null) {
        related.remove();
    }
}

// Placeholder function for hiding recommended videos
function hideRecommended() {
    // No action needed
}

// Function triggered on window scroll
function onWindowScroll() {
    processActions(window.lastResponse);
}

// Call onWindowLoad with a delay
function callWindowLoadWithTimeOut() {
    setTimeout(onWindowLoad, 2000);
}

// Add event listener for window load
if (window.addEventListener) {
    window.addEventListener('load', callWindowLoadWithTimeOut, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', callWindowLoadWithTimeOut);
}
