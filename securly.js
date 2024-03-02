const {
    findCrextnBasegene,
    setupListener,
    putURLCache,
    getBlockUrl,
    getLocation,
    interceptOrNot,
    takeDenyActionTabs,
    createBlockingRequest,
    createNonBlockingRequest,
    fetchClusterUrl,
    fetchDNS,
    fetchUserAPI,
    skipCacheAndLogAlways,
    isBlockingInProgress,
    setBlockedPage,
    getYtSSRequestHeaders,
    getPauseAction,
    takePauseActionTabs,
    takeToFailedOpenBlockedPage,
    checkSkipListCaching,
    invalidateSkipListCaching,
    isClusterURLAvailable,
    setupOrReload,
    getGeolocationStatus,
    getGeolocation,
    getRemoteIPGeo,
    getVersion,
    getQueryVariable,
    normalizeHostname,
    extractTranslateHostname,
    sendDebugInfo,
    checkAllLoadedTabs,
    clearWebCache,
    getDebugInfo,
    getFilteringInfo,
    siteUrlToBrokerUrl,
    selfClusterCheckBeforeBroker,
    downloadIWFList,
    downloadNonCIPA,
    downloadPhraseMatch,
    setupIWF,
    myB64Encode,
    myB64EncodeHelper,
    getCookies,
    setCookie,
    setClassroomCookies,
    setClearCacheCookie,
    clearCacheIfTTLExpired,
    rebrokerLoadedTabs,
    doBrokerForClassroom,
    latencyPing,
    latencyCheck,
    downloadConfig,
    updateTTLForCrextnCacheConfig,
    cleanURL,
    stripSafeSearchPramas,
    sendSHDataToServer,
    sendSocialPostToServer,
    removeHTMLTags,
    decryptPhrases,
    getFeatureConfig,
    sendThinkTwiceAnalytics,
    sendGoogleChatAnalytics,
    clearBlob,
    notifyProxyIdentified,
    buff2StrWithEmoji,
    buff2Str,
    extractPost,
    extractTweet,
    extractFBPost,
    extractFBPostV2,
    getYoutubeSearchURL,
    getRespArrTabs,
    getRespArr,
    _getResCode,
    getYTOptions,
    onBeforeRequestListener,
    interceptRequest,
    interceptPostRequest,
    interceptGetRequest,
    fetchStringFromJSONObj,
    takeDenyAction,
    takeSafeSearchAction,
    addQueryParamToUrl,
    takeCreativeCommonImageSearchAction,
    updateActive,
    onActivated,
    onUpdated,
    cookieMonster,
    isValidPassCookie,
    getSocialPost
} = require('./securly.functions');
const {
    ENCRYPT,
    CryptoJS
} = require('./encrypt')
module.exports = {
    query,
    chrome,
    FailedOpen,
    window,
    phraseMatchPassPhrase,
    phraseMatchList
};

const identifiedWebsites = [];

// Querying for active tab in the last focused window
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    updateActive(tabs[0]);
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);
});

// Listening for downloads created event
chrome.downloads.onCreated.addListener(function (downloadItem) {
    var url = downloadItem.url;
    if ('text/html' === downloadItem.mime) {
        if (url.length > 1000) {
            url = url.substring(0, 1000);
        }
        var encodedUrl = window.btoa(url);
        var anchor = document.createElement('a');
        anchor.href = url;
        var hostname = anchor.hostname.toLowerCase();
        if ('DENY' === getRespArr(normalizeHostname(hostname), encodedUrl, '', url)[0]) {
            chrome.downloads.cancel(downloadItem.id);
            chrome.downloads.removeFile(downloadItem.id);
        }
    }
});

// Handling messages from content scripts
var previousMeetUrl = '';
chrome.runtime.onConnect.addListener(function (port) {
    if ('gmeet' === port.name) {
        port.onMessage.addListener(function (message, sender) {
            if (message.url !== previousMeetUrl) {
                previousMeetUrl = message.url;
                var encodedUrl = window.btoa(message.url);
                var anchor = document.createElement('a');
                anchor.href = message.url;
                var lHostName = anchor.hostname.toLowerCase();
                lHostName = normalizeHostname(lHostName);
                var responseArr = getRespArrTabs(lHostName, encodedUrl, '', message.url, sender.tab.id, '', false, this);
                var response = responseArr[0];
                var action = responseArr[1];
                if ('DENY' === response) {
                    chrome.tabs.update(sender.tab.id, takeDenyAction(action, 2, encodedUrl));
                }
            }
        });
    }
});

// Listening for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if ('proxyIdentified' === message.type) {
        delete message.type;
        notifyProxyIdentified(message);
    }
});

// Listening for cookie changes
chrome.cookies.onChanged.addListener(function (changeInfo) {
    if ('explicit' !== changeInfo.cause || changeInfo.removed || ('securly.com' !== changeInfo.cookie.domain && -1 === changeInfo.cookie.domain.indexOf('.securly.com'))) {
        return;
    }
    cookieMonster(changeInfo.cookie);
});

class FailedOpen {
    constructor(mode, duration) {
        // Constants for different modes
        this.wideOpenMode = 0;
        this.cipaMode = 1;

        // Initializing properties with default values or provided values
        this.mode = mode !== undefined && mode !== null && mode !== -1 ? mode : this.cipaMode;
        this.duration = duration !== undefined && duration !== null && duration !== -1 ? duration : 300;
        this.timeStamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    }

    // Check if the failed open mode is currently active
    isFailedOpen() {
        return Math.floor(Date.now() / 1000) - this.timeStamp < this.duration;
    }

    // Check if the mode is set to wide open mode
    isWideOpenMode() {
        return this.mode === this.wideOpenMode;
    }
}

window.userStatus = {
    NOTFOUND: -1,
    FOUND: 1
};
window.clusterStatus = {
    ERROR: -2,
    NOTFOUND: -1,
    FOUND: 1,
    AVOID_OS: 2,
    UNKNOWN_SCHOOL: 3
};
window.version = '-';
window.userFound = window.userStatus.NOTFOUND;
window.clusterFound = window.clusterStatus.NOTFOUND;
window.userEmail = 'notloggedin';
window.clusterUrl = 'unknown';
window.ytpref = 'prefnotchecked';
window.ytprefnewvalue = 'notset';
window.hideComments = false;
window.hideRecommended = false;
window.hideThumbnails = false;
window.hideSidebar = false;
window.ytOptionsLastCheck = null;
window.youtubeFrames = [];
window.checkYouTube = true;
window.refDomain = '';
window.lastMapsUrl = '';
window.geolocation = false;
window.geoLat = null;
window.geoLng = null;
window.geoIntervalId = null;
window.needToReloadTabs = 1;
window.isBlockedYTVideo = false;
window.debugIWF = 0;
window.IWFTimeout = 1209600000;
window.isSubFrame = false;
window.checkiFrames = 0;
window.failedOpenObj = null;
window.twitterMessageURI = '/statuses/update.json';
window.twitterPrefetchTimestamp = 'prefetchtimestamp';
window.tabsBeingBlocked = {};
window.brokredRequest = [];
window.brokeredArrIndex = 0;
window.lastBrokeredRequest = '';
window.fid = null;
window.latencyFrequency = 600000;
window.latencyAPI = null;
window.latencyInterval = null;
window.defaultConfigTTL = window.currentConfigTTL = 3600000;
window.skipList = [];
window.selfharmlist = [];
window.bullyPhrases = [];
window.wlBullyPhrases = [];
window.thinkTwicePassPhrase = 'Th!nkTw!ce';
const phraseMatchPassPhrase = 'SeCuRlY@321$';
window.featureConfig = {};
var phraseMatchList = {
    Bully: [],
    Grief: [],
    Violence: []
};
chrome.cookies.getAll({ domain: 'securly.com' }, function (e) {
    e.forEach(function (e) {
        cookieMonster(e);
    });
});
// Init
getVersion();
getGeolocationStatus();
setInterval(function () {
    getGeolocationStatus();
    getFeatureConfig();
    window.brokredRequest = [];
}, 3600000);
setInterval(clearBlob, 3000);
setupListener();
fetchUserAPI();
setupIWF();
downloadConfig();
updateTTLForCrextnCacheConfig(window.defaultConfigTTL);
getFeatureConfig();