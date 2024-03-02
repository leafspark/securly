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


chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, function (e) {
    updateActive(e[0]);
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);
});
chrome.downloads.onCreated.addListener(function (e) {
    var t = e.url;
    if ('text/html' == e.mime) {
        t.length > 1000 && (t = t.substring(0, 1000));
        var n = window.btoa(t), o = document.createElement('a');
        o.href = t;
        var r = o.hostname.toLowerCase();
        if ('DENY' == getRespArr(r = normalizeHostname(r), n, '', t)[0]) {
            return chrome.downloads.cancel(e.id), void chrome.downloads.removeFile(e.id);
        }
    }
});
var previousMeetUrl = '';
chrome.runtime.onConnect.addListener(function (e) {
    'gmeet' == e.name && e.onMessage.addListener(function (e, t) {
        if (e.url != previousMeetUrl) {
            previousMeetUrl = e.url;
            let n = window.btoa(e.url), o = document.createElement('a');
            o.href = e.url;
            lHostName = o.hostname.toLowerCase();
            let r = lHostName;
            lHostName = normalizeHostname(r);
            let i = getRespArrTabs(lHostName, n, '', e.url, t.sender.tab.id, '', false, this), s = i[0], a = i[1];
            'DENY' == s && chrome.tabs.update(t.sender.tab, takeDenyAction(a, 2, n));
        }
    });
});
chrome.runtime.onMessage.addListener(function (e, t, n) {
    'proxyIdentified' === e.type && (delete e.type, notifyProxyIdentified(e));
});
chrome.cookies.onChanged.addListener(function (e) {
    'explicit' != e.cause || e.removed || 'securly.com' != e.cookie.domain && -1 == e.cookie.domain.indexOf('.securly.com') || cookieMonster(e.cookie);
});
class FailedOpen {
    constructor(e, t) {
        this.wideOpenMode = 0;
        this.cipaMode = 1;
        this.mode = e;
        this.duration = t;
        void 0 !== this.mode && null != this.mode && -1 != this.mode || (this.mode = 1);
        void 0 !== this.duration && null != this.duration && -1 != this.duration || (this.duration = 300);
        this.timeStamp = Math.floor(Date.now() / 1000);
    }
    isFailedOpen() {
        return Math.floor(Date.now() / 1000) - this.timeStamp < this.duration;
    }
    isWideOpenMode() {
        return this.mode == this.wideOpenMode;
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