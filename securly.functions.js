function putURLCache(response, isSubframe, host, isSecure) {
    if (response.indexOf('WL_URL') === -1 || typeof window.crextnBasegene_bit0 !== 'undefined' && window.crextnBasegene_bit0 === window.bit0) {
        if (isSecure !== 0 || typeof window.crextnBasegene_bit0 !== 'undefined' && window.crextnBasegene_bit0 === window.bit0) {
            sessionStorage.setItem(host, response + ',' + new Date().getTime() / 1000);
        }
    } else {
        var decodedUrl = window.atob(isSubframe).replace(/(^\w+:|^)\/\//, '');
        sessionStorage.setItem(decodedUrl, response + ',' + new Date().getTime() / 1000);
    }
}

function findCrextnBasegene(response) {
    var parts = response.split(':');
    if (parts.length >= 9) {
        window.crextnBasegene = Long.fromString(parts[8], true).shiftRight(0).toNumber();
        window.bit0 = Long.fromNumber(Math.pow(2, 0)).shiftRight(0).toNumber();
        window.crextnBasegene_bit0 = Long.fromNumber(window.crextnBasegene).and(Math.pow(2, 0)).shiftRight(0).toNumber();
    }
}
function setupListener() {
    chrome.tabs.onCreated.addListener(function (tab) {
        if ('complete' === tab.status && '' === tab.url) {
            chrome.tabs.get(tab.id, function (tabInfo) {
                if ('loading' === tabInfo.status && typeof tabInfo.pendingUrl !== 'undefined') {
                    tabInfo.url = tabInfo.pendingUrl;
                    tabInfo.type = 'main_frame';
                    tabInfo.method = 'GET';
                    tabInfo.tabId = tabInfo.id;
                    onBeforeRequestListener(tabInfo);
                }
            });
        }
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
        if (typeof changeInfo.status !== 'undefined' && tabInfo.url.indexOf('blocked') !== -1) {
            if ('complete' !== changeInfo.status) {
                if (tabInfo.url.indexOf('blocked') === -1 || tabInfo.url.indexOf('securly.com') === -1 || tabInfo.url.indexOf('iheobagjkfklnlikgihanlhcddjoihkg') === -1) {
                    window.tabsBeingBlocked[tabId] = tabInfo.url;
                }
            } else {
                delete window.tabsBeingBlocked[tabId];
            }
        }
    });

    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        var isPrefetch = false;
        details.requestHeaders.forEach(function (header) {
            if (header.name === 'Purpose' && header.value === 'prefetch') {
                isPrefetch = true;
            }
        });
        if (!isPrefetch) {
            var url = details.url;
            var intercept = interceptOrNot(details);
            if (intercept === 1) {
                intercept = checkSkipListCaching(details);
            }
            if (url.length > 1000) {
                url = url.substring(0, 1000);
            }
            var base64Url = window.btoa(url);
            var anchorElement = document.createElement('a');
            anchorElement.href = url;
            var hostname = anchorElement.hostname.toLowerCase();
            if (hostname.indexOf('google.co') !== -1 && hostname.indexOf('mail.google.co') !== -1) {
                var resCode = _getResCode(hostname, base64Url);
                if (resCode) {
                    var resCodeParts = resCode.split(':');
                    if (resCodeParts[0] === 'GM') {
                        return {
                            requestHeaders: details.requestHeaders.concat({
                                name: 'X-GoogApps-Allowed-Domains',
                                value: resCodeParts[4]
                            })
                        };
                    }
                }
            }
            if (intercept === 1) {
                var initiatorBase64 = '';
                var isSubframe = false;
                if (typeof details.initiator !== 'undefined') {
                    var initiatorUrl = new URL(details.initiator);
                    initiatorBase64 = window.btoa(initiatorUrl.hostname.toLowerCase());
                }
                if (details.type === 'sub_frame') {
                    isSubframe = true;
                    window.isSubFrame = true;
                    window.brokredRequest = [];
                } else {
                    window.isSubFrame = false;
                    isSubframe = false;
                    window.youtubeFrames = [];
                }
                if (url.indexOf('youtube.') !== -1 && window.checkYouTube === false || url.indexOf('youtube.') === -1 || details.initiator !== window.refDomain) {
                    var responseArray = getRespArr(hostname, base64Url, '', url, initiatorBase64, isSubframe);
                }
                var responseCode = responseArray[0];
                var domainFlag = responseArray[1];
                var restrictFlag = responseArray[2];
                var restrictLevel = responseArray[3];
                var allowedDomains = responseArray[4];
                responseArray[5];
                responseArray[6];
                if (this.iframeResp.length > 0 && this.iframeResp[0] === 'DENY') {
                    this.iframeResp = '';
                    return { cancel: true };
                } else {
                    if (url.indexOf('youtube.') !== -1 && domainFlag === 'REFWL') {
                        window.refDomain = details.initiator;
                        window.checkYouTube = false;
                    } else if (url.indexOf('youtube.') !== -1) {
                        window.checkYouTube = true;
                    }
                    if (responseCode === 'GM') {
                        return {
                            requestHeaders: details.requestHeaders.concat({
                                name: 'X-GoogApps-Allowed-Domains',
                                value: allowedDomains
                            })
                        };
                    } else if (responseCode === 'YT' && window.checkYouTube === true) {
                        if (restrictLevel === 2) {
                            details.requestHeaders.push({
                                name: 'YouTube-Restrict',
                                value: 'Strict'
                            });
                        } else if (restrictLevel === 1) {
                            details.requestHeaders.push({
                                name: 'YouTube-Restrict',
                                value: 'Moderate'
                            });
                        }
                        return { requestHeaders: details.requestHeaders };
                    } else {
                        return { requestHeaders: details.requestHeaders };
                    }
                }
            }
        }
    }, {
        urls: [
            '*://*.youtube.com/*',
            '*://accounts.google.com/*',
            '*://mail.google.com/*',
            '*://drive.google.com/*'
        ]
    }, ['blocking', 'requestHeaders']);

    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        return onBeforeRequestListener(details);
    }, { urls: ['<all_urls>'] }, ['blocking', 'requestBody']);

    chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
        if (signedIn === true) {
            fetchUserAPI();
        }
    });

    chrome.idle.onStateChanged.addListener(function (state) {
        if (lastKnownState !== state) {
            if (state === 'active' && lastKnownState !== 'idle') {
                sessionStorage.clear();
                if (window.featureConfig && window.featureConfig.reload_tabs === 1) {
                    rebrokerLoadedTabs();
                } else {
                    chrome.windows.getAll({ populate: true }, function (windows) {
                        for (var i = 0; i < windows.length; i++) {
                            for (var j = 0; j < windows[i].tabs.length; j++) {
                                if (windows[i].tabs[j].url.substring(0, 9) !== 'chrome://') {
                                    tabCheck.forEach(function (pattern) {
                                        if (windows[i].tabs[j].url.indexOf(pattern) !== -1) {
                                            chrome.tabs.reload(windows[i].tabs[j].id, { bypassCache: true });
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
            lastKnownState = state;
        }
    });

    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name === 'search_engine_parser') {
            port.onMessage.addListener(function (message) {
                if (message.action === 'fetchResult' && window.selfharmlist.length > 0) {
                    port.postMessage(window.selfharmlist);
                } else if (message.action === 'sendSHResult') {
                    if (message.msg.length === 0 || message.domain + message.msg === window.lastSearch) {
                        return;
                    }
                    window.lastSearch = message.domain + message.msg;
                    sendSHDataToServer(message.msg, message.url, message.matchedTerm, message.domain);
                }
            });
        } else if (port.name === 'think_twice') {
            port.onMessage.addListener(function (message) {
                if (message.action === 'fetchThinkTwice') {
                    port.postMessage({
                        ...window.featureConfig,
                        ...{
                            bullyPhrases: window.bullyPhrases,
                            wlBullyPhrases: window.wlBullyPhrases,
                            thinkTwiceSites: window.thinkTwiceSites
                        }
                    });
                } else if (message.action === 'sendThinkTwiceAnalytics') {
                    sendThinkTwiceAnalytics(message.tt_id, message.site, message.tt_action, message.typedText, message.matchedPhrase);
                }
            });
        } else if (port.name === 'gchat-widget') {
            port.onMessage.addListener(function (message) {
                if (message.action === 'fetchInitialConfiguration') {
                    port.postMessage({
                        action: 'initConfig',
                        phraseMatchList: phraseMatchList,
                        featureConfig: window.featureConfig,
                        userEmail: window.userEmail
                    });
                } else if (message.action === 'sendGoogleChatAnaltics') {
                    sendGoogleChatAnalytics(JSON.parse(message.data));
                }
            });
        } else if (port.name === 'rproxport') {
            port.onMessage.addListener(function (message) {
                if (message.action === 'rprox') {
                    takeDenyActionTabs(0, 256, -1, btoa(message.data.url), activeTab.id, false, false);
                }
            });
        } else if (port.name === 'proxyDetection') {
            port.onMessage.addListener(function (message) {
                if (message.action === 'identifyProxy') {
                    port.postMessage({ proxyConfig: window.proxyIdentification });
                }
            });
        }
    });
}
function getLocation(e) {
    var t = document.createElement('a');
    return t.href = e, t;
}
function interceptOrNot(e) {
    var t = 0, n = e.type, o = e.url, r = getLocation(o).hostname, i = getLocation(o).pathname;
    if (window.clusterFound == window.clusterStatus.AVOID_OS || 'AVOID_OS' == window.clusterUrl || 'UNKNOWN_SCHOOL' == window.clusterUrl) {
        return t = 0;
    }
    if (0 === e.url.indexOf('file')) {
        return 0;
    }
    var s = o.replace(/^https?\:\/\//i, '');
    s = s.replace(/^www\.\b/i, '');
    new URL(o);
    var a = s.length;
    '/' === s.charAt(a - 1) && (s = s.slice(0, -1));
    var c = ENCRYPT(s);
    if (null !== localStorage.getItem(c)) {
        return window.featureConfig.isAwareOnly || window.featureConfig.isDiscernMode ? 0 : (takeDenyActionTabs('G', 'BL', '', window.btoa(s), e.tabId), t = 0);
    }
    if (window.failedOpenObj && window.failedOpenObj.isFailedOpen()) {
        if (window.featureConfig.isAwareOnly) {
            return 0;
        }
        if (window.failedOpenObj.isWideOpenMode()) {
            t = 0;
        } else {
            0 == r.indexOf('www.') && (r = r.substr(4));
            var l = ENCRYPT(r), d = localStorage.getItem('NC:' + l);
            null == d || 'main_frame' != n && 'sub_frame' != n || takeToFailedOpenBlockedPage(e.tabId, r, d);
        }
        return t;
    }
    if (-1 == o.indexOf('youtube.com') && (o = o.toLowerCase()), -1 != r.indexOf('google.co') && -1 != i.indexOf('/maps/') && -1 != i.indexOf('/place/')) {
        return t = 1;
    }
    if ('main_frame' !== n && 'sub_frame' !== n && 'xmlhttprequest' !== n) {
        return t = 0;
    }
    if ('securly.com' == new URL(o).hostname || -1 != new URL(o).hostname.indexOf('.securly.com')) {
        if (t = 0, -1 != i.indexOf('crextn/debug') && 'xmlhttprequest' != n) {
            var u = getDebugInfo();
            u.sourceFunction = 'interceptOrNot';
            sendDebugInfo(u);
        }
        return t;
    }
    return -1 != r.indexOf('twitter.com') && (-1 != i.indexOf(window.twitterMessageURI) || -1 != i.indexOf('graphql') && -1 != i.indexOf('CreateTweet') || -1 != o.indexOf(window.twitterPrefetchTimestamp) && -1 == e.tabId) && 'xmlhttprequest' == n ? t = 1 : !r.indexOf('facebook.com') || -1 == i.indexOf('updatestatus') && -1 == i.indexOf('webgraphql') && -1 == i.indexOf('api/graphql') || 'xmlhttprequest' != n ? -1 != r.indexOf('google.co') && -1 != i.indexOf('/plusappui/mutate') && 'xmlhttprequest' == n ? t = 1 : -1 != r.indexOf('google.co') ? (t = 0, 'xmlhttprequest' != n && 'main_frame' != n ? t = 0 : -1 != r.indexOf('accounts.google.co') || -1 != r.indexOf('docs.google.co') || -1 != i.indexOf('/calendar/') || -1 != r.indexOf('code.google.co') || -1 != i.indexOf('/cloudprint') || -1 != i.indexOf('/_/chrome/newtab') || -1 != r.indexOf('appengine.google.com') || -1 != i.indexOf('/complete/search') || -1 != i.indexOf('/webhp') ? t = 0 : -1 != r.indexOf('meet.google.co') ? t = 1 : -1 != i.indexOf('/search') || -1 != i.indexOf('/#q') || -1 != r.indexOf('translate.google.co') || -1 != r.indexOf('remotedesktop.google.co') ? t = 1 : -1 != r.indexOf('mail.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('drive.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('sites.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('hangouts.google.co') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('plus.google.co') && 'main_frame' == n ? t = 1 : 0) : -1 != r.indexOf('youtube.com') && 'main_frame' == n ? t = 1 : -1 != r.indexOf('youtube.com') && 'sub_frame' == n && -1 != i.indexOf('embed') ? t = 1 : -1 == r.indexOf('youtube.com') || -1 == i.indexOf('watch_fragments_ajax') && -1 == i.indexOf('doubleclick/DARTIframe.html') && -1 == i.indexOf('ad_data_204') && -1 == i.indexOf('annotations_invideo') && -1 == i.indexOf('api/stats/atr') && -1 == i.indexOf('get_video_info') ? -1 != i.indexOf('youtubei/v1/search') || -1 != i.indexOf('youtube.com/results') ? 1 : 'main_frame' != n && 'sub_frame' != n || -1 == r.indexOf('youtube.com') ? -1 != r.indexOf('facebook.com') && 'sub_frame' == n ? t = 0 : -1 != r.indexOf('bing.com') && -1 != i.indexOf('/fd/fb') || -1 != r.indexOf('ssl.bing.com') || -1 != i.indexOf('/passport.aspx') ? t = 0 : -1 != r.indexOf('bing.com') && 'sub_frame' === n ? t = 1 : 'main_frame' == n || 'sub_frame' == n && 1 == window.checkiFrames ? t = 1 : t : -1 != i.indexOf('youtubei/v1/search') ? 1 : '/' == i ? 1 : -1 == i.indexOf('/results') && -1 == i.indexOf('/watch') ? 0 : -1 != o.indexOf('pbj=1') ? 0 : t = 1 : t = 0 : t = 1;
}
function getBlockUrl(policyId, categoryId, reasonCode, keyword, isSubFrame) {
    var reason = 'domainblockedforuser';
    var encodedKeyword = '';

    if (reasonCode === 'GL') {
        reason = 'GEO';
    }

    if (categoryId !== '-1') {
        reason = 'safesearch';
        encodedKeyword = window.btoa(keyword);
    }

    var listType = '';
    if (['BL', 'BL_SRCH', 'WL', 'WL_SRCH'].includes(categoryId)) {
        listType = categoryId;
    }

    if (categoryId !== 'BL' && categoryId !== 'BL_SRCH') {
        if (categoryId === 'BANNED') {
            reason = 'banned';
        }
        if (categoryId !== 'WL' && categoryId !== 'WL_SRCH') {
            reason = 'whitelistonly';
            listType = 'WL';
        }
    }

    if (window.clusterUrl !== 'unknown') {
        var decodedUrl = window.atob(policyId);
        var domain = decodedUrl.substr(decodedUrl.indexOf('://') + 3);
        var encodedUrl = window.btoa(domain);

        var blockUrl = window.clusterUrl.replace('/crextn', '') + '/blocked?useremail=' + window.userEmail + '&reason=' + reason + '&categoryid=' + categoryId + '&policyid=' + policyId + '&keyword=' + encodedKeyword + '&url=' + encodedUrl + '&ver=' + window.version + (isSubFrame === 1 ? '&subFrame=1' : '') + '&extension_id=' + chrome.runtime.id;

        if (window.geoLat && window.geoLng) {
            blockUrl += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }

        if (listType) {
            blockUrl += '&listType=' + listType;
        }

        return blockUrl;
    }
}

function takeDenyActionTabs(domainId, policyId, categoryId, reasonCode, tabId, isSubFrame, reBroker) {
    invalidateSkipListCaching(domainId, false);
    clearWebCache(domainId);
    window.brokredRequest = [];

    var reason = 'domainblockedforuser';
    var keyword = '';
    if (reasonCode === 'GL') {
        reason = 'GEO';
    }
    if (categoryId !== '-1') {
        reason = 'safesearch';
        keyword = window.btoa(categoryId);
    }
    var listType = '';
    if (['BL', 'BL_SRCH', 'WL', 'WL_SRCH'].includes(categoryId)) {
        listType = categoryId;
    }
    if (categoryId !== 'BL' && categoryId !== 'BL_SRCH') {
        if (categoryId === 'BANNED') {
            reason = 'banned';
        }
        if (categoryId !== 'WL' && categoryId !== 'WL_SRCH') {
            reason = 'whitelistonly';
            listType = 'WL';
        }
    }
    if (window.clusterUrl !== 'unknown') {
        var decodedDomain = window.atob(domainId);
        var domain = decodedDomain.substr(decodedDomain.indexOf('://') + 3);
        domainId = window.btoa(domain);
        var clusterUrl = window.clusterUrl.replace('/crextn', '');
        var userEmail = window.userEmail;
        var url = clusterUrl + '/blocked?useremail=' + userEmail + '&reason=' + reason + '&categoryid=' + categoryId + '&policyid=' + policyId + '&keyword=' + keyword + '&url=' + domainId + '&ver=' + window.version + (isSubFrame === 1 ? '&subFrame=1' : '') + '&extension_id=' + chrome.runtime.id;
        if (window.geoLat && window.geoLng) {
            url += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        if (listType) {
            url += '&listType=' + listType;
        }
        if (reBroker !== undefined && reBroker) {
            url += '&rebroker=1';
        }
        isBlockingInProgress(tabId, 'http://' + window.atob(domainId))
            .then(function (isBlocking) {
                if (!isBlocking) {
                    setBlockedPage(tabId, url);
                }
            })
            .catch(function (error) {
                console.log('Exception in checking blocking progress:', error);
                setBlockedPage(tabId, url);
            });
    }
}
function createBlockingRequest(e, t) {
    if (-1 !== t.indexOf('http://') || -1 !== t.indexOf('https://') || 'manifest.json' === t) {
        var n = new XMLHttpRequest();
        return n.open(e, t, false), n;
    }
    return null;
}
function createNonBlockingRequest(e, t) {
    if (-1 !== t.indexOf('http://') || -1 !== t.indexOf('https://') || 'manifest.json' === t) {
        var n = new XMLHttpRequest();
        return n.open(e, t, true), n;
    }
    return null;
}
function fetchClusterUrl() {
    var e = window.userEmail.split('@')[1], t = createBlockingRequest('get', checkClusterURL + '/crextn/cluster?domain=' + e + '&reasonCode=' + window.clusterFound), n = localStorage.getItem('cluster');
    if (n && 2 == (n = n.split(',')).length) {
        var o = 0;
        if ((o = new Date().getTime() / 1000 - n[1]) < 0 && (o = 31622400), o < 31536000 && 'UNKNOWN_SCHOOL' != n[0] && 'unknown' != window.ClusterUrl) {
            if (window.clusterUrl = n[0], window.clusterFound = window.clusterStatus.FOUND, 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl) {
                return 1 == window.needToReloadTabs && (window.needToReloadTabs = 0, checkAllLoadedTabs()), latencyCheck(), getGeolocationStatus(), void getFeatureConfig();
            }
            if (o < 3600 && 'AVOID_OS' == window.clusterUrl) {
                return void (window.clusterFound = window.clusterStatus.AVOID_OS);
            }
        } else {
            if (o < 3600 && ('UNKNOWN_SCHOOL' == n[0] || 'unknown' == window.ClusterUrl)) {
                return window.clusterUrl = n[0], void ('UNKNOWN_SCHOOL' == window.clusterUrl && (window.clusterFound = window.clusterStatus.UNKNOWN_SCHOOL));
            }
        }
    }
    t.onreadystatechange = function () {
        if (4 == t.readyState && 200 == t.status) {
            var e = t.responseText.trim();
            window.debugIWF = 0;
            -1 !== e.lastIndexOf('_disableIWF') ? (window.clusterUrl = e.slice(0, e.lastIndexOf('_disableIWF')), window.debugIWF = 1, localStorage.clear()) : -1 !== e.lastIndexOf('_updateIWF') ? (window.clusterUrl = e.slice(0, e.lastIndexOf('_updateIWF')), window.debugIWF = 2, downloadIWFList(), downloadNonCIPA()) : (window.clusterUrl = e, localStorage.setItem('cluster', window.clusterUrl + ',' + new Date().getTime() / 1000));
            window.clusterFound = window.clusterStatus.FOUND;
            setupIWF();
            getGeolocationStatus();
            getFeatureConfig();
            'UNKNOWN_SCHOOL' != window.clusterUrl ? 'AVOID_OS' != window.clusterUrl ? 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl && latencyCheck() : window.clusterFound = window.clusterStatus.AVOID_OS : window.clusterFound = window.clusterStatus.UNKNOWN_SCHOOL;
        } else {
            window.clusterFound = window.clusterStatus.ERROR;
        }
    };
    try {
        t.send();
    } catch (e) {
        console.log('Send error uc4');
    }
    true === forceClusterUrl && (window.clusterUrl = DEBUG_clusterUrl, window.clusterFound = 1, getGeolocationStatus(), getFeatureConfig());
    setupOrReload();
}
function fetchDNS() {
    domainCheck = checkClusterURL.replace(/http:\/\/|https:\/\//gi, '');
    var e = createBlockingRequest('get', 'https://dns.google.com/resolve?name=' + domainCheck + '&type=A');
    e.onreadystatechange = function () {
        if (200 == e.status) {
            var t = JSON.parse(e.responseText.trim());
            'object' == typeof t && (t.Answer.length >= 2 ? (window.checkClusterURL = 'https://' + t.Answer[1].data, fetchClusterUrl()) : 1 == t.Answer.length && (window.checkClusterURL = 'https://' + t.Answer[0].data, fetchClusterUrl()));
        }
    };
    e.send();
}
function fetchUserAPI() {
    chrome.identity.getProfileUserInfo(function (e) {
        var t = e.email;
        true === forceUserEmail && (t = DEBUG_userEmail);
        '' !== t ? (window.userEmail = t, window.userFound = window.userStatus.FOUND, fetchClusterUrl()) : (window.clusterFound = window.clusterStatus.AVOID_OS, window.clusterUrl = 'AVOID_OS');
    });
}
function skipCacheAndLogAlways(e, t) {
    return -1 != e.indexOf('twitter.com') ? 1 : -1 != e.indexOf('facebook.com') ? 1 : -1 != e.indexOf('google.co') && -1 == e.indexOf('mail.google.co') && -1 == e.indexOf('drive.google.co') ? 1 : -1 != e.indexOf('bing.co') ? 1 : -1 != e.indexOf('search.yahoo.co') ? 1 : -1 != e.indexOf('wikipedia.org') ? 1 : -1 != e.indexOf('youtube.co') ? 1 : 0;
}
function isBlockingInProgress(tabId, url) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.get(tabId, function (tab) {
            if (tab && tab.status === 'loading') {
                var urlDetails = new URL(url);
                if ((urlDetails.hostname.endsWith('.securly.com') && (urlDetails.pathname === 'blocked' || urlDetails.pathname === 'blocked.php')) || (urlDetails.hostname === 'iheobagjkfklnlikgihanlhcddjoihkg' && urlDetails.pathname === 'blocked.html')) {
                    resolve(true);
                }
                if (tab.pendingUrl !== undefined) {
                    urlDetails = new URL(tab.pendingUrl);
                    if ((urlDetails.hostname.endsWith('.securly.com') && (urlDetails.pathname === 'blocked' || urlDetails.pathname === 'blocked.php')) || (urlDetails.hostname === 'iheobagjkfklnlikgihanlhcddjoihkg' && urlDetails.pathname === 'blocked.html')) {
                        resolve(true);
                    }
                }
            }
            resolve(false);
        });
    });
}
function setBlockedPage(tabId, blockedUrl) {
    if (tabId === -1) {
        tabId = null;
    }
    if (tabId > 0) {
        window.tabsBeingBlocked[tabId] = blockedUrl;
        chrome.tabs.get(tabId, function (tab) {
            if (tab.url.indexOf('chrome') !== 0 && tab.url.indexOf('securly.com/') === -1) {
                chrome.tabs.executeScript(tabId, {
                    allFrames: true,
                    code: 'window.stop(); window.location = \'\';',
                    runAt: 'document_start'
                });
            }
        });
    }
    chrome.tabs.update(tabId, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html' });
    chrome.tabs.update(tabId, { url: blockedUrl }, function () {
        if (chrome.runtime.lastError) {
            console.log('Some error occurred while redirecting to blocked page:', chrome.runtime.lastError);
            setTimeout(function () {
                chrome.tabs.update(null, { url: blockedUrl });
            }, 500);
        }
    });
}

function getYtSSRequestHeaders(url, headers) {
    if (url.includes('/results') || url.includes('/search') || url.includes('/watch')) {
        var cookies = '';
        for (var i = 0; i < headers.length; ++i) {
            if (headers[i].name === 'Cookie') {
                cookies = headers[i].value;
                headers.splice(i, 1);
                break;
            }
        }
        if (cookies === '') {
            headers.push({
                name: 'Cookie',
                value: 'PREF=f2=8000000'
            });
        } else {
            var prefIndex = cookies.indexOf('PREF');
            if (prefIndex === -1) {
                headers.push({
                    name: 'Cookie',
                    value: cookies + '; PREF=f2=8000000'
                });
            } else {
                var prefValueIndex = cookies.indexOf('8000000', prefIndex);
                if (prefValueIndex === -1) {
                    cookies += '&f2=8000000';
                }
                headers.push({
                    name: 'Cookie',
                    value: cookies
                });
            }
        }
    }
    return headers;
}

function getPauseAction(url) {
    invalidateSkipListCaching(url, true);
    clearWebCache(url);
    window.brokredRequest = [];
    if (window.clusterUrl === 'unknown') {
        return { cancel: true };
    } else {
        return { redirectUrl: window.clusterUrl.replace('/crextn', '') + '/paused' };
    }
}

function takePauseActionTabs(url, tabId) {
    var action = getPauseAction(url);
    if (action.redirectUrl !== undefined) {
        var redirectUrl = action.redirectUrl;
        chrome.tabs.update(tabId, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html' });
        chrome.tabs.update(tabId, { url: redirectUrl }, function () {
            if (chrome.runtime.lastError) {
                console.error('Error updating tab:', chrome.runtime.lastError);
            }
        });
        setTimeout(function () {
            chrome.tabs.update(null, { url: redirectUrl });
        }, 500);
    }
}

function takeToFailedOpenBlockedPage(tabId, siteUrl, categoryFlags) {
    var encodedSiteUrl = btoa(siteUrl);
    var categories = [];
    if (categoryFlags & Math.pow(2, 3)) categories.push('Pornography');
    if (categoryFlags & Math.pow(2, 4)) categories.push('Drugs');
    if (categoryFlags & Math.pow(2, 5)) categories.push('Gambling');
    var encodedCategories = btoa(categories.join(', '));
    window.brokredRequest = [];
    chrome.tabs.update(tabId, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html?site=' + encodedSiteUrl + '&category=' + encodedCategories }, function () {
        if (chrome.runtime.lastError) {
            console.error('Error updating tab:', chrome.runtime.lastError);
        }
    });
}

function checkSkipListCaching(url) {
    var hostname = new URL(url).hostname.toLowerCase();
    var currentTime = Math.floor(Date.now() / 1000);
    var keys = Object.keys(window.skipList);
    var found = keys.find(function (key) {
        if (key === hostname) {
            var ttl = window.skipList[key].ttl;
            var lastBrokerCall = window.skipList[key].last_broker_call;
            return ttl === -1 || (currentTime - lastBrokerCall) >= ttl;
        } else if (key.includes('*')) {
            var regex = new RegExp(window.skipList[key].regx);
            return regex.test(hostname);
        }
        return false;
    });
    if (found) {
        window.skipList[found].last_broker_call = currentTime;
        return true;
    }
    return false;
}

function invalidateSkipListCaching(url, resetAll) {
    var hostname = new URL(window.atob(url)).hostname.toLowerCase();
    if (resetAll) {
        Object.keys(window.skipList).forEach(function (key) {
            window.skipList[key].last_broker_call = 0;
        });
    } else {
        var keys = Object.keys(window.skipList);
        keys.forEach(function (key) {
            if (key === hostname) {
                window.skipList[key].last_broker_call = 0;
            } else if (key.includes('*')) {
                var regex = new RegExp(window.skipList[key].regx);
                if (regex.test(hostname)) {
                    window.skipList[key].last_broker_call = 0;
                }
            }
        });
    }
}

function isClusterURLAvailable() {
    return window.userEmail && 'UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl;
}
function setupOrReload() {
    window.userFound == window.userStatus.FOUND && window.clusterFound == window.clusterStatus.FOUND ? ('UNKNOWN_SCHOOL' !== window.clusterUrl && 'AVOID_OS' !== window.clusterUrl && 'unknown' !== window.clusterUrl && 1 == window.needToReloadTabs && (window.needToReloadTabs = 0, checkAllLoadedTabs()), setTimeout(function () {
        fetchClusterUrl();
    }, 1800000), sessionStorage.clear()) : window.clusterFound == window.clusterStatus.AVOID_OS ? (window.needToReloadTabs = 1, setTimeout(function () {
        fetchClusterUrl();
    }, 1800000), sessionStorage.clear()) : (console.log('https://www.securly.com/crextn/blocked?useremail=' + window.userEmail + '&reason=notregistered&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + '&ver=' + window.version + '&url='), setTimeout(function () {
        fetchClusterUrl();
    }, 1800000));
}
function getGeolocationStatus() {
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var e = createBlockingRequest('get', window.clusterUrl + '/getGeoStatus?userEmail=' + window.userEmail);
        e.onload = function () {
            window.geolocation = parseInt(e.responseText.trim());
            window.geolocation && (getGeolocation(), null != window.geoIntervalId && clearInterval(window.geoIntervalId), window.geoIntervalId = setInterval(function () {
                getGeolocation();
            }, 60000));
        };
        try {
            e.send();
        } catch (e) {
            console.log('Geolocation request error.');
        }
    }
}
function getGeolocation() {
    navigator.geolocation.getCurrentPosition(function (e) {
        window.geoLat = e.coords.latitude;
        window.geoLng = e.coords.longitude;
    }, function (e) {
        console.log('Geolocation error occurred. Error code: ' + e.code);
    }, {
        timeout: 30000,
        maximumAge: 300000
    });
}
function getRemoteIPGeo() {
    if (window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
        var request = createBlockingRequest('GET', window.clusterUrl + '/getGeoStatus?ip=1');
        request.onload = function () {
            var responseText = request.responseText.trim();
            if (responseText !== window.geoLastIP) {
                getGeolocation();
                window.geoLastIP = responseText;
            }
        };
        try {
            request.send();
        } catch (error) {
            console.log('Geolocation remote IP request error.');
        }
    }
}

function getVersion() {
    var request = createBlockingRequest('GET', 'manifest.json');
    request.onload = function () {
        var manifest = JSON.parse(request.responseText);
        window.version = manifest.version;
    };
    try {
        request.send();
    } catch (error) {
        console.log('Send error u2');
    }
}

function getQueryVariable(url, variable) {
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.replace(/\?/, '').split('&');
    for (var i = 0; i < query.length; i++) {
        var pair = query[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return '';
}

function normalizeHostname(hostname) {
    var normalized = hostname;
    if (hostname.startsWith('www.')) {
        normalized = hostname.substr(4);
    } else if (hostname.startsWith('m.')) {
        normalized = hostname.substr(2);
    }
    return normalized;
}

function extractTranslateHostname(url) {
    var translateHostname = 'translate.google.com';
    var query = getQueryVariable(url, 'u');
    if (query !== '') {
        var decodedQuery = decodeURIComponent(query).toLowerCase().replace('http://', '').replace('https://', '');
        var slashIndex = decodedQuery.indexOf('/');
        translateHostname = slashIndex !== -1 ? decodedQuery.substr(0, slashIndex) : decodedQuery;
    }
    return translateHostname;
}

function sendDebugInfo(data) {
    var url = window.clusterUrl + '/debug';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    try {
        xhr.send(JSON.stringify(data));
    } catch (error) {
        console.log('Send error u3');
    }
}

function checkAllLoadedTabs() {
    window.needToReloadTabs = 0;
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.url.indexOf('securly.com') === -1 && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
                chrome.tabs.reload(tab.id);
            }
        });
    });
}

function clearWebCache(base64Url) {
    try {
        var decodedUrl = window.atob(base64Url);
        var hostname = new URL(decodedUrl).hostname.replace('www.', '');

        var currentTime = new Date().getTime();
        var fiveMinutesAgo = currentTime - 300000;

        chrome.browsingData.removeCache({ since: fiveMinutesAgo }, function () {
            if (chrome.runtime.lastError) {
                console.log('Error clearing cache:', chrome.runtime.lastError.message);
            }
        });

        chrome.browsingData.remove({
            origins: [
                'https://' + hostname,
                'https://www.' + hostname
            ]
        }, {
            cacheStorage: true,
            fileSystems: true,
            indexedDB: true,
            localStorage: true,
            pluginData: true,
            serviceWorkers: true,
            webSQL: true
        }, function () {
            if (chrome.runtime.lastError) {
                console.log('Error clearing browsing data:', chrome.runtime.lastError.message);
            }
        });
    } catch (error) {
        console.log('Clearing web cache failed. Base64 URL:', base64Url);
    }
}

function getDebugInfo() {
    var e = {
        clusterUrl: window.clusterUrl,
        userEmail: window.userEmail
    };
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var t = createBlockingRequest('get', window.clusterUrl.replace('crextn', 'app/session'));
        t.onerror = function () {
            e.sessionInfo = 'Network Error';
            console.log(e);
        };
        t.onload = function () {
            e.sessionInfo = t.responseText;
        };
        t.send();
        for (var n = [
            'http://www.maxim.com',
            'http://www.amazon.com',
            'http://www.google.com',
            'http://www.bing.com',
            'http://search.yahoo.com',
            'http://www.youtube.com',
            'http://mail.google.com',
            'http://plus.google.com',
            'http://www.facebook.com',
            'http://docs.google.com',
            'http://drive.google.com',
            'http://sites.google.com'
        ], o = 0; o < n.length; o++) {
            e = getFilteringInfo(n[o], e);
        }
    }
    return e;
}
function getFilteringInfo(url, info) {
    var request = createBlockingRequest('get', siteUrlToBrokerUrl(url));
    request.onerror = function () {
        info[url] = 'Network Error';
    };
    request.onload = function () {
        info[url] = request.responseText.trim();
    };
    request.send();
    return info;
}

function siteUrlToBrokerUrl(url) {
    var tempLink = document.createElement('a');
    tempLink.href = url;
    var hostname = tempLink.hostname.toLowerCase();
    var encodedUrl = window.btoa(url);
    return window.geolocation ?
        window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + hostname + '&url=' + encodedUrl + '&msg=&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound + '&lat=' + window.geoLat + '&lng=' + window.geoLng :
        window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + hostname + '&url=' + encodedUrl + '&msg=&ver=' + window.version + '&cu=' + window.clusterUrl + '&uf=' + window.userFound + '&cf=' + window.clusterFound;
}

function selfClusterCheckBeforeBroker() {
    if ('unknown' === window.clusterUrl || (window.clusterFound !== window.clusterStatus.FOUND && window.clusterFound !== window.clusterStatus.AVOID_OS)) {
        window.needToReloadTabs = 0;
        fetchClusterUrl();
    }
}

function downloadIWFList() {
    localStorage.clear();
    var request = createNonBlockingRequest('get', 'http://cdn1.securly.com/iwf-encode.txt');
    request.onreadystatechange = function () {
        if (4 == request.readyState) {
            if (200 == request.status) {
                String.prototype.replaceAll = function (find, replace) {
                    return this.split(find).join(replace);
                };
                var lines = request.responseText.replaceAll('\r', '').trim().split('\n');
                for (var i = 0; i < lines.length; i++) {
                    localStorage.setItem(lines[i], '1');
                }
                var currentTime = new Date();
                localStorage.setItem('currIWFTime', currentTime);
            } else {
                console.log('iwf error', request.status);
            }
        }
    };
    request.send();
}

function downloadNonCIPA() {
    var request = createNonBlockingRequest('get', 'http://cdn1.securly.com/non-cipa-encode.txt');
    request.onreadystatechange = function () {
        if (4 == request.readyState) {
            if (200 == request.status) {
                String.prototype.replaceAll = function (find, replace) {
                    return this.split(find).join(replace);
                };
                var lines = request.responseText.replaceAll('\r', '').trim().split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var parts = lines[i].split(',');
                    localStorage.setItem('NC:' + parts[0], parts[1]);
                }
            } else {
                console.log('non-cipa error', request.status);
            }
        }
    };
    request.send();
}

function downloadPhraseMatch() {
    const request = createNonBlockingRequest('get', 'http://cdn1.securly.com/pmatch.json');
    request.onreadystatechange = function () {
        if (4 == request.readyState) {
            if (200 == request.status) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(request.responseText, phraseMatchPassPhrase).toString(CryptoJS.enc.Utf8);
                    if (decrypted && decrypted.length > 0) {
                        phraseMatchList = JSON.parse(decrypted);
                    }
                } catch (error) {
                    console.error('parse error for phrase match', error);
                }
            } else {
                console.error('download error for phrase match', request.status);
            }
        }
    };
    request.send();
}
function setupIWF() {
    var currentTime = new Date().getTime();
    var lastIWFTime = Date.parse(localStorage.getItem('currIWFTime'));

    if (isNaN(lastIWFTime)) {
        if (isNaN(lastIWFTime) && window.debugIWF === 0) {
            downloadIWFList();
            downloadNonCIPA();
            downloadPhraseMatch();
        }
    } else {
        if (currentTime - lastIWFTime >= window.IWFTimeout) {
            downloadIWFList();
            downloadNonCIPA();
            downloadPhraseMatch();
        }
    }
}

function myB64Encode(input, shift) {
    var characters = window.btoa(input).split('');

    for (var i = 0; i < characters.length; i++) {
        characters[i] = myB64EncodeHelper(characters[i], shift);
    }

    return characters.join('');
}

function myB64EncodeHelper(character, shift) {
    var charCode = character.charCodeAt(0);

    if ('0' <= character && character <= '9') {
        charCode += shift %= 10;
        if (charCode > '9'.charCodeAt(0)) {
            charCode -= 10;
        }
    } else if ('A' <= character && character <= 'Z') {
        charCode += shift %= 26;
        if (charCode > 'Z'.charCodeAt(0)) {
            charCode -= 26;
        }
    } else if ('a' <= character && character <= 'z') {
        charCode += shift %= 26;
        if (charCode > 'z'.charCodeAt(0)) {
            charCode -= 26;
        }
    }

    return String.fromCharCode(charCode);
}

function getCookies() {
    var cookies = document.cookie.split(';');
    var cookieMap = {};

    for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        cookieMap[(parts[0] + '').trim()] = unescape(parts[1]);
    }

    return cookieMap;
}

function setCookie(name, value, hours) {
    var expires = 0;

    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (60 * hours * 60 * 1000));
        expires = 'expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function setClassroomCookies() {
    chrome.cookies.getAll({ domain: 'securly.com', name: 'live_session' }, function (cookies) {
        if (cookies && cookies.length > 0) {
            setCookie('live_session', cookies[0].value, 5);
        } else {
            setCookie('live_session', '0', 5);
        }
    });

    chrome.cookies.getAll({ domain: 'securly.com', name: 'classroom_enabled' }, function (cookies) {
        if (cookies && cookies.length > 0) {
            setCookie('classroom_enabled', cookies[0].value, 1440);
        } else {
            setCookie('classroom_enabled', '0', 1440);
        }
    });
}

function setClearCacheCookie(e) {
    var host = new URL(window.clusterUrl).host;

    chrome.cookies.getAll({ domain: host, name: 'crextn_clear_cache_at' }, function (cookies) {
        if (cookies && cookies.length > 0) {
            var existingCookies = getCookies();
            setCookie('crextn_clear_cache_at', cookies[0].value);
            console.debug('[setClearCacheCookie]', 'crextn_clear_cache_at cookie updated', cookies[0].value);

            if (existingCookies.crextn_clear_cache_at !== undefined && existingCookies.crextn_clear_cache_at != decodeURIComponent(cookies[0].value)) {
                console.debug('[setClearCacheCookie]', 'session cleared and rebrokering loaded tabs');
                sessionStorage.clear();
                rebrokerLoadedTabs(e);
            }
        }
    });
}

function clearCacheIfTTLExpired() {
    var cookies = getCookies();

    if (cookies.crextn_clear_cache_at !== undefined) {
        if (new Date().getTime() >= new Date(cookies.crextn_clear_cache_at).getTime()) {
            console.debug('[clearCacheIfTTLExpired]', 'session cleared');
            sessionStorage.clear();
        }
    } else {
        console.debug('[clearCacheIfTTLExpired]', 'crextn_clear_cache_at cookie not found');
    }
}

function rebrokerLoadedTabs(excludedTabId) {
    excludedTabId = (excludedTabId === undefined) ? '' : excludedTabId;

    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].id != excludedTabId && tabs[i].url.indexOf('securly.com') === -1) {
                if (tabs[i].url.indexOf('http://') !== -1 || tabs[i].url.indexOf('https://') !== -1) {
                    tabs[i].initiator = '';
                    tabs[i].type = 'main_frame';
                    tabs[i].method = 'GET';
                    tabs[i].tabId = tabs[i].id;
                    onBeforeRequestListener(tabs[i], true);
                }
            }
        }
    });
}

function doBrokerForClassroom() {
    var cookies = getCookies();

    if (1 == cookies.classroom_enabled && cookies.classroom_enabled !== undefined) {
        if (1 == cookies.live_session && cookies.live_session !== undefined) {
            return true;
        }

        var currentTime = Math.floor(Date.now() / 1000);
        return (cookies.last_broker_call !== undefined && currentTime - cookies.last_broker_call > 300) ? true : (setCookie('last_broker_call', currentTime, 5), true);
    }

    return false;
}

function latencyPing() {
    var startTime = Date.now();
    var request = createNonBlockingRequest('get', 'https://' + window.latencyAPI + '/ping');

    request.onreadystatechange = function () {
        if (4 == request.readyState && 200 == request.status) {
            var latency = Date.now() - startTime;
            createNonBlockingRequest('get', 'https://' + window.latencyAPI + '/latency_report?fid=' + window.fid + '&user=' + window.userEmail + '&latency=' + latency).send();
        }
    };

    request.send();
}

function latencyCheck() {
    var lastCheckTime = localStorage.getItem('last_latency_check');

    if ((lastCheckTime == null || Math.floor(Date.now() / 1000) - lastCheckTime >= 86400) && window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
        var request = createNonBlockingRequest('get', window.clusterUrl + '/internetQualityFeed?userEmail=' + window.userEmail);

        request.onreadystatechange = function () {
            if (4 == request.readyState) {
                if (200 == request.status) {
                    var response = JSON.parse(request.responseText);

                    if (1 == response.is_active) {
                        window.fid = response.fid;

                        if (window.latencyFrequency !== response.frequency && window.latencyInterval !== null) {
                            clearInterval(window.latencyInterval);
                            window.latencyInterval = null;
                        }

                        window.latencyFrequency = response.frequency;
                        window.latencyAPI = response.api_server;

                        if (window.latencyInterval === null) {
                            window.latencyInterval = setInterval(function () {
                                latencyPing();
                            }, Math.floor(60 * window.latencyFrequency * 1000));
                        }
                    } else if (window.latencyInterval !== null) {
                        clearInterval(window.latencyInterval);
                        window.latencyInterval = null;
                    }

                    localStorage.setItem('last_latency_check', Math.floor(Date.now() / 1000));
                } else {
                    localStorage.setItem('last_latency_check', Math.floor(Date.now() / 1000));
                }
            }
        };

        request.send();
    }
}

function downloadConfig() {
    var request = createNonBlockingRequest('GET', 'http://cdn1.securly.com/config.json');

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var responseText = request.responseText.trim();
                if (responseText.length === 0) {
                    window.skipList = [];
                    return;
                }

                var config = JSON.parse(responseText);
                updateConfig(config);
            }
        }
    };

    request.send();
}

function updateConfig(config) {
    var skipList = {};

    if (config.skiplist) {
        config.skiplist.forEach(function (entry) {
            var key = Object.keys(entry)[0].trim();
            if (key.length > 0) {
                skipList[key] = {
                    ttl: entry[key],
                    last_broker_call: 0
                };

                if (key.includes('*')) {
                    var regexPattern = key.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/');
                    skipList[key].regx = new RegExp(regexPattern);
                }

                if (window.skipList[key] !== undefined) {
                    skipList[key].last_broker_call = window.skipList[key].last_broker_call;
                }
            }
        });
    }

    window.skipList = skipList;
    window.selfharmlist = config.selfharmlist !== undefined ? config.selfharmlist : [];
    window.vectorExpansionRules = config.vectorExpansionRules !== undefined ? config.vectorExpansionRules : {};
    window.bullyPhrases = config.bullyPhrases !== undefined ? decryptPhrases(config.bullyPhrases) : [];
    window.wlBullyPhrases = config.wlBullyPhrases !== undefined ? decryptPhrases(config.wlBullyPhrases) : [];
    window.thinkTwiceSites = config.thinkTwiceSites !== undefined ? config.thinkTwiceSites : [];

    if (config.ttl !== undefined) {
        var newConfigTTL = 1000 * config.ttl;
        if (newConfigTTL !== window.currentConfigTTL) {
            window.currentConfigTTL = newConfigTTL;
            updateTTLForCrextnCacheConfig(window.currentConfigTTL);
        }
    } else if (window.defaultConfigTTL !== window.currentConfigTTL) {
        window.currentConfigTTL = window.defaultConfigTTL;
        updateTTLForCrextnCacheConfig(window.defaultConfigTTL);
    }

    window.proxyIdentification = config.proxyIdentification !== undefined ? config.proxyIdentification : [];
}


function updateTTLForCrextnCacheConfig(interval) {
    if (window.cacheIntervalId !== undefined) {
        clearInterval(window.cacheIntervalId);
    }

    window.cacheIntervalId = setInterval(function () {
        downloadConfig();
    }, interval);
}

function cleanURL(url) {
    return url.replace(/^(?:https?:\/\/)?/i, '');
}

function stripSafeSearchPramas(e) {
    return [
        '&safe=active',
        '\\?safe=active',
        '&adlt=strict',
        '\\?adlt=strict',
        '&vm=r',
        '\\?vm=r'
    ].map(function (t) {
        e = e.replace(new RegExp(t + '$'), '');
    }), e;
}
function isSeachRequest(e, t) {
    return -1 != e.indexOf('google.co') && -1 != t.indexOf('/search') || -1 != e.indexOf('bing.com') && -1 != t.indexOf('/search') || -1 != e.indexOf('search.yahoo.com') && -1 != t.indexOf('/search');
}
function sendSHDataToServer(search, url, match, domain) {
    if (isClusterURLAvailable()) {
        let encodedSearch = window.btoa(search);
        let encodedUrl = window.btoa(url);
        let encodedMatch = window.btoa(match);
        let encodedDomain = window.btoa(domain);
        let requestUrl = window.clusterUrl + '/flaggedSearches?search=' + encodedSearch + '&url=' + encodedUrl + '&match=' + encodedMatch + '&domain=' + encodedDomain + '&extension_id=' + chrome.runtime.id;
        if (window.geolocation) {
            requestUrl += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        let request = createNonBlockingRequest('get', requestUrl);
        try {
            request.send();
        } catch (error) {
            console.log('Send self harm data failed');
        }
    }
}

function sendSocialPostToServer(msg, domain, context, url) {
    if (isClusterURLAvailable()) {
        let encodedMsg = window.btoa(encodeURIComponent(msg));
        let encodedDomain = window.btoa(domain);
        let encodedContext = window.btoa(context);
        let encodedUrl = window.btoa(url);
        let requestUrl = window.clusterUrl + '/socialActivity?msg=' + encodedMsg + '&domain=' + encodedDomain + '&context=' + encodedContext + '&url=' + encodedUrl + '&extension_id=' + chrome.runtime.id;
        if (window.geolocation) {
            requestUrl += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
        }
        let request = createNonBlockingRequest('get', requestUrl);
        try {
            request.send();
        } catch (error) {
            console.log('Send social post failed');
        }
    }
}

function removeHTMLTags(inputString) {
    if (inputString === null || inputString === '' || inputString === undefined) {
        return '';
    }
    return inputString.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ');
}

function decryptPhrases(phrases) {
    let decryptedPhrases = [];
    phrases.forEach(function (phrase) {
        let decryptedPhrase = CryptoJS.AES.decrypt(phrase, window.thinkTwicePassPhrase).toString(CryptoJS.enc.Utf8);
        if (decryptedPhrase && decryptedPhrase.length > 0) {
            decryptedPhrases.push(decryptedPhrase);
        }
    });
    return decryptedPhrases;
}

function getFeatureConfig() {
    if (isClusterURLAvailable()) {
        let request = createNonBlockingRequest('get', window.clusterUrl + '/config');
        request.onreadystatechange = function () {
            if (request.status === 200 && request.readyState === 4) {
                try {
                    let response = JSON.parse(request.responseText);
                    if (typeof response === 'object' && response && response.success === 1) {
                        window.featureConfig = response;
                    } else {
                        console.log('Not able to fetch feature config');
                    }
                } catch (error) {
                    console.log('Not able to fetch feature config');
                }
            }
        };
        request.send();
    }
}

function sendThinkTwiceAnalytics(tt_id, site, action, typed_text, matched_phrase) {
    if (isClusterURLAvailable()) {
        let request = createNonBlockingRequest('POST', window.clusterUrl + '/thinktwice');
        request.onreadystatechange = function () {
            if (request.status === 200 && request.readyState === 4) {
                try {
                    let response = JSON.parse(request.responseText);
                    if (typeof response === 'object' && response && response.success === 1) {
                        console.log('Successfully logged think twice analytics');
                    } else {
                        console.log('Failed to log the think twice analytics');
                    }
                } catch (error) {
                    console.log('Failed to log the think twice analytics');
                }
            }
        };
        let formData = new FormData();
        formData.append('tt_id', tt_id);
        formData.append('site', site);
        formData.append('action', action);
        formData.append('typed_text', typed_text);
        formData.append('matched_phrase', matched_phrase);
        request.send(formData);
    }
}

function sendGoogleChatAnalytics(data) {
    if (isClusterURLAvailable()) {
        let formData = new FormData();
        formData.append('chatRoomId', data.chatRoomId);
        formData.append('chatMembers', JSON.stringify(data.chatMembers));
        formData.append('flagged_text', data.flagged_text);
        formData.append('matched_phrase', data.matched_phrase);
        formData.append('context', JSON.stringify(data.context));
        formData.append('score', data.score);
        formData.append('confidence', data.confidence);
        formData.append('type_detail', data.type_detail);
        const request = createNonBlockingRequest('post', window.clusterUrl + '/gchat?userEmail=' + window.userEmail);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status !== 200) {
                console.log('Error while sending chat to server from captured analytics', request.status);
            }
        };
        try {
            request.send(formData);
        } catch (error) {
            console.error('Failed to send chat to server from captured analytics', error);
        }
    }
}

function clearBlob() {
    chrome.cookies.getAll({ domain: '.securly.com' }, function (cookies) {
        cookies.forEach(function (cookie) {
            if (cookie.value.indexOf('blob') !== -1) {
                chrome.tabs.query({ currentWindow: true }, function (tabs) {
                    tabs.forEach(function (tab) {
                        if (tab.url.indexOf('securly.com') !== -1) {
                            chrome.tabs.remove(tab.id);
                        }
                    });
                });
                chrome.cookies.remove({ url: 'https://' + cookie.domain + cookie.path, name: cookie.name });
            }
        });
    });
}

function notifyProxyIdentified(proxyInfo) {
    if (isClusterURLAvailable() && !identifiedWebsites.includes(proxyInfo.proxyUrl)) {
        var request = createNonBlockingRequest('POST', window.clusterUrl + '/proxy');
        var formData = new FormData();
        formData.append('domain', proxyInfo.proxyUrl);
        formData.append('proxyFamily', proxyInfo.proxyName);
        formData.append('rules', JSON.stringify(proxyInfo.targetElements || proxyInfo.rules));
        try {
            request.send(formData);
            identifiedWebsites.push(proxyInfo.proxyUrl);
        } catch (error) {
            console.log('Identifying proxy failed');
        }
    }
}

function buff2StrWithEmoji(buffer) {
    return new TextDecoder().decode(buffer);
}

function buff2Str(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function extractPost(content, startMarker, endMarker) {
    var startIndex = content.indexOf(startMarker) + startMarker.length;
    var endIndex = content.indexOf(endMarker);
    return content.substring(startIndex, endIndex);
}

function extractTweet(content) {
    var parsedContent = JSON.parse(content);
    if (parsedContent.variables && parsedContent.variables.length > 0) {
        var variables = JSON.parse(parsedContent.variables);
        if (variables.tweet_text && variables.tweet_text.length > 0) {
            return variables.tweet_text;
        }
    }
    return parsedContent.variables && Object.keys(parsedContent.variables).length > 0 && parsedContent.variables.tweet_text && parsedContent.variables.tweet_text.length > 0 ? parsedContent.variables.tweet_text : '';
}
function extractFBPost(content) {
    var params, tempArray, post;
    for (var i = 0; i < (tempArray = (params = content.split('&'))).length; i++) {
        if (0 == tempArray[0].indexOf('variables=')) {
            post = JSON.parse(tempArray[0].substr(10));
            return post.input.message.text;
        }
    }
}
function extractFBPostV2(content) {
    var parsedContent = JSON.parse(content.variables);
    try {
        if ('feed' == parsedContent.input.composer_type && parsedContent.input.message.text) {
            return parsedContent.input.message.text;
        }
    } catch (e) {
        return false;
    }
    return false;
}
function getYoutubeSearchURL(request, defaultURL) {
    if (void 0 !== request.requestBody.raw) {
        var bufferContent = convertBufferToStringWithEmoji(request.requestBody.raw[0].bytes);
        var parsedContent = JSON.parse(bufferContent);
        if (void 0 !== parsedContent.query) {
            defaultURL = request.initiator + '/results?search_query=' + encodeURIComponent(parsedContent.query);
        }
    }
    return defaultURL;
}
function getRespArrTabs(host, url, message, userFound, version, frameHost = '', isSubframe = false, reason, cookies = null, rebroker = false) {
    // Clear cache if TTL expired unless `rebroker` is explicitly set to true
    if (typeof rebroker !== 'undefined' && !rebroker) {
        clearCacheIfTTLExpired();
        rebroker = false;
    }

    // Get resource code
    var resCode = _getResCode(host, url);
    var response = '';

    // Check if user is not logged in
    if (userEmail === 'notloggedin') {
        return ('DENY:0:-1:-1:-1:-1:-1').split(':');
    }

    // Check if broker should be performed for classroom
    if (doBrokerForClassroom() && (resCode = ''), resCode) {
        if (resCode.includes('ALLOW') && skipCacheAndLogAlways(host, message) === 0) {
            wellPathWidgBg.triggerWidgetDisplay();
        } else {
            let channelId = null, videoId = null, category = null;
            if (selfClusterCheckBeforeBroker(), cookies !== null && (channelId = cookies.channelId, videoId = cookies.videoId, category = cookies.category), response = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + host + '&url=' + url + '&msg=' + message + '&ver=' + version + '&cu=' + window.clusterUrl + '&uf=' + userFound + '&cf=' + window.clusterFound + (isSubframe ? '&subframe=1' : '') + (frameHost !== '' ? '&frameHost=' + frameHost : '') + (channelId !== null ? '&channelID=' + channelId : '') + (videoId !== null ? '&videoID=' + videoId : '') + (category !== null ? '&category=' + encodeURIComponent(category) : '') + '&extension_id=' + chrome.runtime.id, rebroker && (response += '&rebroker=1'), resCode.startsWith('SS') && stripSafeSearchPramas(message) === window.lastBrokeredRequest) {
                return resCode.split(':');
            }
            if (window.lastBrokeredRequest = message, window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
                var xhr = createNonBlockingRequest('get', response);
                xhr.onerror = function () {
                    response = 'ERROR:-1:-1:-1:-1:-1:-1';
                };
                xhr.onload = function () {
                    if (typeof rebroker !== 'undefined' && rebroker || setClearCacheCookie(cookies), wellPathWidgBg.triggerWidgetDisplay(), response.indexOf('FAILED_OPEN:') !== 0) {
                        if (!response.toLowerCase().includes('<html')) {
                            var parts = response.split(':'),
                                action = parts[0],
                                errorCode = parts[1],
                                reasonCode = parts[2],
                                categoryCode = parts[3],
                                cacheTime = parts[2],
                                isSecure = false;

                            if (!isNaN(cacheTime) && cacheTime >= 0) {
                                var cacheTimeInt = Long.fromString(cacheTime, true).shiftRight(0).toNumber(),
                                    pow36 = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
                                if (Long.fromNumber(cacheTimeInt).and(Math.pow(2, 36)).shiftRight(0).toNumber() === pow36) {
                                    isSecure = true;
                                }
                            }

                            if (action !== 'DENY' && action !== 'PAUSE') {
                                try {
                                    putURLCache(response, url, host, isSecure);
                                } catch (e) {
                                    sessionStorage.clear();
                                }
                            } else {
                                if (action === 'DENY') {
                                    takeDenyActionTabs(errorCode, reasonCode, categoryCode, url, cookies, 0, rebroker);
                                } else if (action === 'PAUSE') {
                                    takePauseActionTabs(url, cookies);
                                }
                            }
                        }
                    } else {
                        var failParts = response.split(':');
                        window.failedOpenObj = new FailedOpen(failParts[1], failParts[2]);
                    }
                };
                try {
                    xhr.send();
                } catch (e) {
                }
            } else {
                response = 'ERORR:-1:-1:-1:-1:-1:-1';
            }
        }
    } else {
        let channelId = null, videoId = null, category = null;
        if (selfClusterCheckBeforeBroker(), cookies !== null && (channelId = cookies.channelId, videoId = cookies.videoId, category = cookies.category), response = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + host + '&url=' + url + '&msg=' + message + '&ver=' + version + '&cu=' + window.clusterUrl + '&uf=' + userFound + '&cf=' + window.clusterFound + (isSubframe ? '&subframe=1' : '') + (frameHost !== '' ? '&frameHost=' + frameHost : '') + (channelId !== null ? '&channelID=' + channelId : '') + (videoId !== null ? '&videoID=' + videoId : '') + (category !== null ? '&category=' + encodeURIComponent(category) : '') + '&extension_id=' + chrome.runtime.id, window.geolocation && (response += '&lat=' + window.geoLat + '&lng=' + window.geoLng), rebroker && (response += '&rebroker=1'), isSubframe === 0) {
            if (window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
                var xhr = createNonBlockingRequest('get', response);
            }
        } else {
            let isSearchRequest = false;
            if (isSeachRequest(host, message) && stripSafeSearchPramas(message) === window.lastBrokeredRequest && (isSearchRequest = true), window.lastBrokeredRequest = message, !isSearchRequest && window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
                var xhr = createBlockingRequest('get', response);
            }
        }
        if (window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
            xhr.onerror = function () {
                response = 'ERROR:-1:-1:-1:-1:-1:-1';
            };
            xhr.onload = function () {
                if (response.indexOf('FAILED_OPEN:') !== 0) {
                    if (cookies !== null && (window.failedOpenObj = null), window.checkiFrames = response.split(':')[7], !isNaN(response.split(':')[2]) && response.split(':')[2] >= 0) {
                        var cacheTime = Long.fromString(response.split(':')[2], true).shiftRight(0).toNumber(),
                            pow36 = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber(),
                            isSecure = false;
                        if (Long.fromNumber(cacheTime).and(Math.pow(2, 36)).shiftRight(0).toNumber() === pow36) {
                            isSecure = true;
                        }
                        if (typeof rebroker !== 'undefined' && rebroker || setClearCacheCookie(cookies), wellPathWidgBg.triggerWidgetDisplay(), setClassroomCookies(), response.indexOf('DENY') === -1 && response.indexOf('PAUSE') === -1) {
                            try {
                                putURLCache(response, isSubframe, host, isSecure);
                                setCookie('last_broker_call', Math.floor(Date.now() / 1000), 5);
                            } catch (e) {
                                sessionStorage.clear();
                            }
                        } else {
                            if (response.indexOf('PAUSE') === 0) {
                                takePauseActionTabs(isSubframe, cookies);
                            } else {
                                if (!response.toLowerCase().includes('<html')) {
                                    var parts = response.split(':'),
                                        errorCode = parts[1],
                                        reasonCode = parts[2],
                                        categoryCode = parts[3];

                                    if (isSubframe === 0 || window.checkiFrames === 0) {
                                        window.isSubFrame = false;
                                        isSubframe = false;
                                        takeDenyActionTabs(errorCode, reasonCode, categoryCode, isSubframe, cookies, window.isSubFrame, rebroker);
                                    } else if (window.checkiFrames === 1) {
                                        cookies.iframeResp = parts;
                                        if (frameHost !== '' && window.atob(url) !== frameHost) {
                                            window.isSubFrame = true;
                                            isSubframe = true;
                                            cookies.iframeBlockUrl = getBlockUrl(errorCode, reasonCode, categoryCode, url, window.isSubFrame);
                                        } else {
                                            window.isSubFrame = false;
                                            isSubframe = false;
                                            takeDenyActionTabs(errorCode, reasonCode, categoryCode, isSubframe, cookies, window.isSubFrame, rebroker);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (window.featureConfig.isAwareOnly) {
                        return;
                    }
                    var failParts = response.split(':');
                    window.failedOpenObj = new FailedOpen(failParts[1], failParts[2]);
                    if (!window.failedOpenObj.isWideOpenMode()) {
                        if (host.indexOf('www.') === 0) {
                            host = host.substr(4);
                        }
                        var encryptedHost = ENCRYPT(host),
                            cache = localStorage.getItem('NC:' + encryptedHost);
                        if (cache === null || !window.featureConfig.isDiscernMode) {
                            takeToFailedOpenBlockedPage(cookies, host, cache);
                        }
                    }
                }
            };
            try {
                xhr.send();
            } catch (e) {
                response = 'ERROR:-1:-1:-1:-1:-1:-1';
            }
        } else {
            response = 'ERROR:-1:-1:-1:-1:-1:-1';
        }
        response = (url.includes('google.c') && !url.includes('sites.google.com') && !url.includes('docs.google.com') && !url.includes('drive.google.com') && !url.includes('accounts.google.com') && !url.includes('calendar.google.com') && !url.includes('code.google.com')) || url.includes('bing.com') ? 'SS:0:-1:-1:-1:-1:-1' : 'ALLOW:0:-1:-1:-1:-1:-1';
        if (url.includes('search.yahoo.com')) {
            response = 'SS:0:CC:-1:-1:-1:-1';
        }
    }
    var parts = response.split(':');
    if (typeof parts === 'undefined' || parts === null || parts.length < 7) {
        response = 'ERROR:-1:-1:-1:-1:-1:-1';
        sessionStorage.removeItem(host);
        parts = response.split(':');
    }
    return parts;
}
function getRespArr(host, url, message, userFound, version, frameHost = '', isSubframe = false) {
    var resCode = _getResCode(host, url);
    var response = '';

    if (doBrokerForClassroom() && (resCode = ''), resCode) {
        wellPathWidgBg.triggerWidgetDisplay();
    } else {
        if (selfClusterCheckBeforeBroker(), response = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&host=' + host + '&url=' + url + '&msg=' + message + '&ver=' + version + '&cu=' + window.clusterUrl + '&uf=' + userFound + '&cf=' + window.clusterFound + (isSubframe ? '&subframe=1' : '') + (frameHost !== '' ? '&frameHost=' + frameHost : '') + '&extension_id=' + chrome.runtime.id, window.geolocation && (response += '&lat=' + window.geoLat + '&lng=' + window.geoLng), window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
            var xhr = createBlockingRequest('get', response);
            xhr.onerror = function () {
                resCode = 'ERROR:-1:-1:-1:-1:-1:-1';
            };
            xhr.onload = function () {
                if (wellPathWidgBg.triggerWidgetDisplay(), setClearCacheCookie(), setClassroomCookies(), response.indexOf('FAILED_OPEN:') !== 0) {
                    var cacheTime = xhr.responseText.trim().split(':')[2];
                    window.checkiFrames = xhr.responseText.trim().split(':')[7];
                    findCrextnBasegene(xhr.responseText.trim());
                    var isSecure = false;
                    if (!isNaN(cacheTime) && cacheTime >= 0) {
                        var cacheTimeInt = Long.fromString(cacheTime, true).shiftRight(0).toNumber();
                        var pow36 = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
                        if (Long.fromNumber(cacheTimeInt).and(Math.pow(2, 36)).shiftRight(0).toNumber() === pow36) {
                            isSecure = true;
                        }
                    }
                    if (response.indexOf('DENY') === -1 && skipCacheAndLogAlways(host, message) === 0) {
                        try {
                            if (response.indexOf('WL_URL') === -1 || typeof window.crextnBasegene_bit0 !== 'undefined' && window.crextnBasegene_bit0 === window.bit0) {
                                if (typeof window.crextnBasegene_bit0 !== 'undefined' && window.crextnBasegene_bit0 === window.bit0) {
                                    sessionStorage.setItem(host, xhr.responseText.trim());
                                } else {
                                    sessionStorage.setItem(window.atob(url).replace(/(^\w+:|^)\/\//, ''), xhr.responseText.trim());
                                }
                            }
                            if (!isNaN(cacheTimeInt) && cacheTimeInt === 0) {
                                if (typeof window.crextnBasegene_bit0 !== 'undefined' && window.crextnBasegene_bit0 === window.bit0) {
                                    sessionStorage.setItem(host, xhr.responseText.trim());
                                }
                            }
                            setCookie('last_broker_call', Math.floor(Date.now() / 1000), 5);
                        } catch (e) {
                            sessionStorage.clear();
                        }
                    }
                } else {
                    var failParts = xhr.responseText.trim().split(':');
                    window.failedOpenObj = new FailedOpen(failParts[1], failParts[2]);
                }
            };
            try {
                xhr.send();
            } catch (e) {
                resCode = 'ERROR:-1:-1:-1:-1:-1:-1';
            }
        } else {
            resCode = 'ERROR:-1:-1:-1:-1:-1:-1';
        }
    }
    var parts = resCode.split(':');
    if (typeof parts === 'undefined' || parts === null || parts.length < 7) {
        resCode = 'ERROR:-1:-1:-1:-1:-1:-1';
        sessionStorage.removeItem(host);
        parts = resCode.split(':');
    }
    return parts;
}
function _getResCode(host, url) {
    var decodedUrl = window.atob(url);
    var resultURL = decodedUrl.replace(/(^\w+:|^)\/\/|(\/$)/, '');
    var resCode = null;
    var cachedValue = sessionStorage.getItem(resultURL);
    if (cachedValue) {
        var cachedParts = cachedValue.split(',');
        if (cachedParts.length === 2 && (new Date().getTime() / 1000 - cachedParts[1]) < 1800) {
            resCode = cachedParts[0];
        }
    } else {
        resCode = sessionStorage.getItem(host);
    }
    return resCode;
}



function getYTOptions() {
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        toSendUrl = window.clusterUrl + '/broker?useremail=' + window.userEmail + '&reason=crextn&url=&ytoptions=true';
        var e = createBlockingRequest('get', toSendUrl);
        e.onload = function () {
            let t = e.responseText.trim();
            window.hideComments = 'true' == t.split(':')[0];
            window.hideThumbnails = 'true' == t.split(':')[1];
            window.hideSidebar = 'true' == t.split(':')[2];
            window.ytOptionsLastCheck = Math.floor(Date.now() / 1000);
        };
        try {
            e.send();
        } catch (e) {
            console.log('getYTOptions Request Failed');
        }
    }
}
function onBeforeRequestListener(request, t = false) {
    var url = request.url;
    if (url === 'https://www.pornhub.com/testfiltering' || url === 'https://swearing.testfiltering.com/') {
        return { cancel: true };
    }

    if (request.type === 'main_frame' && url.indexOf('securly') === -1 && window.tabsBeingBlocked[request.tabId] !== undefined) {
        return { redirectUrl: window.tabsBeingBlocked[request.tabId] };
    }

    var mainHost = new URL(request.initiator).hostname.toLowerCase();
    if (mainHost.startsWith('www.')) {
        mainHost = mainHost.substring(4);
    }

    if (window.vectorExpansionRules && window.vectorExpansionRules[mainHost]) {
        for (let rule of window.vectorExpansionRules[mainHost]) {
            try {
                let pattern = rule.pattern.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/');
                let regex = new RegExp(pattern);

                if (regex.test(request.url)) {
                    if (request.method === 'GET') {
                        interceptRequest(request);
                    } else if (request.method === 'POST') {
                        interceptRequest(request);
                    }
                }
            } catch (error) {
                // Handle error
            }
        }
    } else {
        var initiatorHost = new URL(request.initiator).hostname.toLowerCase();
        var mainHost = initiatorHost.startsWith('www.') ? initiatorHost.substring(4) : initiatorHost;

        if (!window.vectorExpansionRules || !window.vectorExpansionRules[mainHost]) {
            var hostname = new URL(request.url).hostname.toLowerCase();
            if (hostname.indexOf('youtube') !== -1) {
                window.youtubeLastCheck = null;
                window.ytURL = url;
                if (window.clusterUrl !== 'UNKNOWN_SCHOOL' && window.clusterUrl !== 'AVOID_OS' && (window.ytOptionsLastCheck === null || Math.floor(Date.now() / 1000) - window.ytOptionsLastCheck >= 3600)) {
                    getYTOptions();
                }
            }
        }
    }
}

const wellPathWidgBg = (function () {
    var cachedResponse = null;
    var lastCacheTime = 0;

    const displayWidget = async () => {
        var clusterHost = new URL(window.clusterUrl).host;
        chrome.cookies.getAll({
            domain: clusterHost,
            name: 'wellness_widget_status'
        }, async cookies => {
            if (window.featureConfig.isDiscernMode) {
                return;
            }
            if (!cookies || cookies.length === 0) {
                return;
            }
            const status = decodeURIComponent(cookies[0].value).split(':');
            if (!status.length || status[1] === 'show') {
                try {
                    const message = {
                        source: 'well-path-widget',
                        action: 'display',
                        data: await (async () => {
                            if (userEmail === 'notloggedin') {
                                throw new Error('User not logged in');
                            }
                            try {
                                var currentTime = new Date().getTime() / 1000;
                                if (currentTime - lastCacheTime <= 5) {
                                    console.debug('Response was saved in the last 5 seconds');
                                    throw new Error('Response was saved in the last 5 seconds');
                                }
                                if (cachedResponse !== null && cachedResponse.userEmail === userEmail && currentTime - cachedResponse.timestamp <= 1800) {
                                    console.debug('Valid content cache found. Elapsed seconds:', currentTime - cachedResponse.timestamp);
                                    return cachedResponse.content;
                                }
                                var url = window.clusterUrl + '/wellnessPathwaysWidgets?action=getWidget';
                                if (window.clusterUrl !== 'unknown' && window.clusterUrl !== 'AVOID_OS' && window.clusterUrl !== 'UNKNOWN_SCHOOL') {
                                    var request = createNonBlockingRequest('get', url);
                                    request.onerror = function () {
                                        console.error('Error in fetching wellness pathways widget');
                                    };
                                    request.onload = function () {
                                        var response = JSON.parse(request.responseText);
                                        if (response.success && response.widget) {
                                            cachedResponse = {
                                                userEmail: userEmail,
                                                id: response.widget.id,
                                                content: response.widget.content,
                                                timestamp: new Date().getTime() / 1000
                                            };
                                            return response.widget.content;
                                        } else {
                                            throw new Error('No widget found');
                                        }
                                    };
                                    request.send();
                                } else {
                                    throw new Error('Invalid cluster URL');
                                }
                            } catch (error) {
                                console.error('Error in fetching widget data', error);
                                throw error;
                            }
                        })()
                    };
                    if (typeof tabId !== 'undefined' && tabId) {
                        chrome.tabs.sendMessage(tabId, message);
                    } else {
                        chrome.tabs.query({}, tabs => {
                            tabs.forEach(tab => {
                                chrome.tabs.sendMessage(tab.id, message);
                            });
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    return chrome.runtime.onMessage.addListener((message, sender) => {
        console.debug('wpw msg received', message, sender);
        if (typeof message === 'object' && message.action !== undefined && message.source !== undefined && sender.tab.id !== -1 && sender.tab.id) {
            if (message.source === 'well-path-widget') {
                if (message.action === 'ready') {
                    displayWidget(sender.tab.id);
                } else if (message.action === 'ctaClicked' || message.action === 'closed') {
                    saveResponse(message);
                    chrome.tabs.query({}, tabs => {
                        tabs.forEach(tab => {
                            chrome.tabs.sendMessage(tab.id, {
                                source: 'well-path-widget',
                                action: 'remove'
                            });
                        });
                    });
                }
            }
        }
    }), { triggerWidgetDisplay: displayWidget };
})();

function interceptRequest(request) {
    if (!window.vectorExpansionRules) {
        return;
    }

    var hosts = Object.keys(window.vectorExpansionRules);
    if (hosts.length === 0) {
        return;
    }

    var initiatorHost = new URL(request.initiator).hostname.toLowerCase();
    var mainHost = cleanURL(initiatorHost);
    if (mainHost.startsWith('www.')) {
        mainHost = mainHost.substring(4);
    }

    if (hosts.includes(mainHost)) {
        for (let i = 0; i < window.vectorExpansionRules[mainHost].length; i++) {
            try {
                const rule = window.vectorExpansionRules[mainHost][i];
                let pattern = rule.pattern.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/');
                let regex = new RegExp(pattern);

                if (regex.test(request.url)) {
                    if (request.method === 'GET') {
                        interceptGetRequest(request, '', mainHost, rule.context, rule, rule.field);
                    } else if (request.method === 'POST') {
                        interceptPostRequest(request, mainHost, rule.content, rule.field, rule.context, '', false, rule);
                    }
                }
            } catch (error) {
                // Handle error
            }
        }
    }
}
function interceptPostRequest(event, url, type, domain, media, caption, story, options) {
    if ('JSON_STR' == type) {
        let jsonData = options.data.split('|').reduce((acc, item) => acc[item], event);
        if (jsonInfo = JSON.parse(jsonData), Array.isArray(media)) {
            for (let i = 0; i < media.length; i += 1) {
                tempText = removeHTMLTags(media[i].split('|').reduce((acc, item) => acc[item], jsonInfo));
                caption = caption.length > 0 ? caption + ' ' + tempText : tempText;
            }
        } else {
            caption = removeHTMLTags(media.split('|').reduce((acc, item) => acc[item], jsonInfo));
        }
        if (url.includes('pinterest.')) {
            const storyInfo = jsonInfo.options.story_pin;
            storyInfo && (parsedTitle = JSON.parse(storyInfo).metadata.pin_title, caption = caption.length > 0 ? caption + ' ' + parsedTitle : parsedTitle);
        }
    } else {
        if ('ENCODED_STR' == type) {
            if (buff = event.requestBody.raw[0].bytes, postData = buff2StrWithEmoji(buff), Array.isArray(media)) {
                for (let i = 0; i < media.length; i += 1) {
                    tempText = media[i].split('|').reduce((acc, item) => new URLSearchParams(acc).get(item), postData);
                    caption = caption.length > 0 ? caption + ' ' + tempText : tempText;
                }
            } else {
                caption = media.split('|').reduce((acc, item) => new URLSearchParams(acc).get(item), postData);
            }
            caption = removeHTMLTags('reddit.com' == url ? fetchStringFromJSONObj(JSON.parse(caption), 't') : caption);
        } else {
            if ('ENCODED' == type) {
                buff = event.requestBody.raw[0].bytes;
                postData = buff2StrWithEmoji(buff);
                let parsedData = JSON.parse(postData);
                if (Array.isArray(media)) {
                    for (let i = 0; i < media.length; i += 1) {
                        url.includes('tumblr.com') && 'content' == media[i] ? tempText = removeHTMLTags(fetchStringFromJSONObj(parsedData, 'text')) : tempText = removeHTMLTags(media[i].split('|').reduce((acc, item) => acc[item], parsedData));
                        caption = caption.length > 0 ? caption + ' ' + tempText : tempText;
                    }
                } else {
                    caption = removeHTMLTags(media.split('|').reduce((acc, item) => -1 == item.indexOf('!') ? acc[item] : acc[item.split('!')[0]][item.split('!')[1]], parsedData));
                }
            } else {
                if ('DOUBLE_ENCODED' == type) {
                    buff = event.requestBody.raw[0].bytes;
                    postData = buff2StrWithEmoji(buff);
                    let jsonData = JSON.parse(postData), options = media.split('||');
                    if ('quora.com' == url && (jsonData && jsonData.queryName && -1 != jsonData.queryName.indexOf('answerCreate') && (domain = 'ANSWER'), jsonData && jsonData.queryName && -1 != jsonData.queryName.toLowerCase().indexOf('draft') && true), options.length > 0) {
                        var content = options[0].split('|').reduce((acc, item) => acc[item], jsonData);
                        if (content) {
                            caption = removeHTMLTags(caption = fetchStringFromJSONObj(JSON.parse(content), 'text'));
                        }
                    }
                } else {
                    if ('QUERY_PARAM' == type) {
                        caption = new Proxy(new URLSearchParams(event.url), { get: (obj, prop) => obj.get(prop) })[media];
                    } else {
                        if (Array.isArray(media)) {
                            for (let i = 0; i < media.length; i += 1) {
                                tempText = removeHTMLTags(media[i].split('|').reduce((acc, item) => {
                                    try {
                                        return -1 == item.indexOf('!') ? acc[item] : acc[item.split('!')[0]][item.split('!')[1]];
                                    } catch (error) {
                                        return '';
                                    }
                                }, event));
                                'reddit.com' == url && -1 != media[i].indexOf('richtext_json') && tempText.length > 0 && (textStr = removeHTMLTags(fetchStringFromJSONObj(JSON.parse(tempText), 't')), captionStr = removeHTMLTags(fetchStringFromJSONObj(JSON.parse(tempText), 'c')), tempText = textStr + ' ' + captionStr);
                                caption = caption.length > 0 ? caption + ' ' + tempText : tempText;
                            }
                        } else {
                            caption = removeHTMLTags(media.split('|').reduce((acc, item) => -1 == item.indexOf('!') ? acc[item] : acc[item.split('!')[0]][item.split('!')[1]], event));
                        }
                    }
                }
            }
        }
    }
    caption && -1 != caption.trim().indexOf(' ') && sendSocialPostToServer(caption, url, domain, event.url);
}
function interceptGetRequest(request, parameterName, token, message, host, paramName) {
    const data = { token: message };
    new URL(request.url).search.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        data[key] = value;
    });
    if (data[paramName]) {
        token = data[paramName];
    }
    if (token !== '') {
        sendSocialPostToServer(token, parameterName, message, request.url);
    }
}

function fetchStringFromJSONObj(obj, key) {
    let result = '';
    for (let prop in obj) {
        if (typeof obj[prop] === 'object') {
            result += ' ' + fetchStringFromJSONObj(obj[prop], key).trim();
        } else if (prop === key) {
            result += ' ' + obj[prop];
        }
    }
    return result.trim();
}

function takeDenyAction(policyId, categoryId, url) {
    invalidateSkipListCaching(url, false);
    clearWebCache(url);
    var reason = 'domainblockedforuser';
    if (policyId === '0' && categoryId === '-1') {
        return { cancel: true };
    }
    var listType = '';
    if (categoryId !== 'BL' && categoryId !== 'BL_SRCH' && categoryId !== 'WL' && categoryId !== 'WL_SRCH') {
        listType = categoryId;
    } else {
        listType = categoryId;
        reason = policyId === 'G' ? 'globalblacklist' : 'policyblacklist';
    }
    if (categoryId === 'BANNED') {
        reason = 'banned';
    }
    if (window.clusterUrl === 'unknown') {
        return { cancel: true };
    }
    var decodedUrl = window.atob(url),
        shortenedUrl = decodedUrl.substr(decodedUrl.indexOf('://') + 3);
    url = window.btoa(shortenedUrl);
    var redirectUrl = window.clusterUrl.replace('/crextn', '') + '/blocked?useremail=' + window.userEmail + '&reason=' + reason + '&categoryid=' + categoryId + '&policyid=' + policyId + '&url=' + url + '&ver=' + window.version + (window.isSubFrame === 1 ? '&subFrame=1' : '') + '&extension_id=' + chrome.runtime.id;
    if (window.geoLat && window.geoLng) {
        redirectUrl += '&lat=' + window.geoLat + '&lng=' + window.geoLng;
    }
    if (listType) {
        redirectUrl += '&listType=' + listType;
    }
    return { redirectUrl: redirectUrl };
}

function takeSafeSearchAction(tabUrl, tabQueryString) {
    if (tabUrl.indexOf('google.co') !== -1 && /q=/.test(tabQueryString)) {
        if (tabQueryString.indexOf('safe=') === -1) {
            return tabQueryString + '&safe=strict';
        }
    } else if (tabUrl.indexOf('bing.com') !== -1 && tabQueryString.indexOf('adlt=strict') === -1) {
        if (tabQueryString.indexOf('?') !== -1) {
            return tabQueryString + '&adlt=strict';
        } else {
            return tabQueryString + '?adlt=strict';
        }
    } else if (tabUrl.indexOf('search.yahoo.com') !== -1 && tabQueryString.indexOf('vm=r') === -1) {
        if (tabQueryString.indexOf('?') !== -1) {
            return tabQueryString + '&vm=r';
        } else {
            return tabQueryString + '?vm=r';
        }
    }
    return tabQueryString;
}

function addQueryParamToUrl(url, paramKey, paramValue) {
    const searchParams = new URLSearchParams(url.split('?')[1]);
    searchParams.delete(paramKey);
    for (const key in paramValue) {
        searchParams.set(key, paramValue[key]);
    }
    return url.split('?')[0] + '?' + searchParams.toString();
}

function takeCreativeCommonImageSearchAction(url) {
    if (url.indexOf('google.co') !== -1 && url.indexOf('tbm=isch') !== -1) {
        if (url.indexOf('tbs=il:cl') === -1) {
            return addQueryParamToUrl(url, 'tbs', { tbs: 'il:cl' });
        }
    } else if (url.indexOf('bing.com/images/search') !== -1 && url.toLowerCase().indexOf('&qft=+filterui:licenseType-Any') === -1) {
        return addQueryParamToUrl(url, 'qft', { qft: '+filterui:licenseType-Any' });
    } else if (url.indexOf('images.search.yahoo.com/search/images') !== -1 && url.indexOf('&imgl=cc') === -1) {
        return addQueryParamToUrl(url, 'imgl', { imgl: 'cc' });
    }
    return url;
}

// Function to update the active tab
function updateActive(tab) {
    activeTab = tab;
}

// Event listener for when a tab is activated
function onActivated(info) {
    chrome.tabs.get(info.tabId, updateActive);
}

// Event listener for when a tab is updated
function onUpdated(tabId, changeInfo) {
    if (changeInfo.active) {
        updateActive(changeInfo);
    }
}

// Function to remove unwanted cookies
function cookieMonster(cookie) {
    // List of cookies to exclude from removal
    const excludedCookies = [
        'live_session',
        'classroom_enabled',
        'last_broker_call',
        'crextn_clear_cache_at',
        'wellness_widget_status',
        'scrh',
        'scru',
        'scrt',
        'scrr',
        'scre',
        'scrc',
        'ext_token_time',
        'ext_enc_token',
        'PHPSESSID',
        'AWSALBCORS',
        'AWSALB',
        'sslReportTime',
        'country',
        'XSRF-TOKEN',
        'ehpv2_session',
        'oidcState',
        'auth_method',
        'SecurlyToken',
        'securly_token',
        'authProducts',
        'vms_bearer',
        'discoverProducts',
        'vms_cluster_fe_url',
        'scru_domain',
        'scru_geo',
        'scru_geoIpAddress'
    ];

    // Check if the cookie name is not in the excluded list and is not a valid pass cookie
    if (!excludedCookies.includes(cookie.name) && !isValidPassCookie(cookie)) {
        // Remove the cookie
        chrome.cookies.remove({
            url: 'https://securly.com' + cookie.path,
            name: cookie.name
        }, function () {
            // Callback function (empty in this case)
        });
    }
}

function isValidPassCookie(e) {
    // Check if the cookie length is 0
    if (0 == e.length) {
        return false;
    }
    // Check if the cookie value is empty, or if it doesn't match the expected format, or if its length is less than 500
    if ('' === e.value || !/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(e.name) || e.value.length < 500) {
        return false;
    }
    try {
        // Decode the cookie value and parse it as JSON
        var t = decodeURIComponent(e.value);
        var n = JSON.parse(window.atob(t));
        // Check if the parsed JSON object has the expected properties and values
        if (40 === e.name.length && n.hasOwnProperty('iv') && n.hasOwnProperty('value') && n.hasOwnProperty('mac') && n.hasOwnProperty('tag') && '' != n.iv && '' != n.value && '' != n.mac) {
            return true; // Return true if the cookie is valid
        }
    } catch (e) {
        return false; // Return false if there's an error during decoding or parsing
    }
    return false; // Return false if the cookie doesn't meet the validation criteria
}

function getSocialPost(e, t) {
    var n = ''; // Initialize empty string for the encoded post content
    var o = ''; // Initialize empty string for the decoded post content

    // Check if the request is related to Twitter
    if (-1 != e.url.indexOf('twitter.com') && ('POST' == e.method && 'xmlhttprequest' == e.type)) {
        var r = ''; // Initialize variable for tweet content

        // Extract tweet content from the request body
        if (void 0 !== e.requestBody.raw) {
            o = buff2StrWithEmoji(e.requestBody.raw[0].bytes); // Decode request body bytes
            r = extractTweet(o); // Extract tweet content
            if ('' == r) {
                r = extractPost(o, '&status=', '&tagged_users'); // If tweet content is empty, try extracting post content
            }
            r = r.replaceAll('\n', ' '); // Replace newline characters with spaces
            r = encodeURIComponent(r); // Encode tweet content
            n = window.btoa(r.toLowerCase()); // Base64 encode and lowercase tweet content
        } else {
            r = e.requestBody.formData.status[0]; // Get tweet content from form data
            r = r.replaceAll('\n', ' '); // Replace newline characters with spaces
            r = encodeURIComponent(r); // Encode tweet content
            n = window.btoa(r.toLowerCase()); // Base64 encode and lowercase tweet content
        }
    }

    // Check if the request is related to Facebook
    if (-1 != t.indexOf('facebook.com') && ('POST' == e.method && 'xmlhttprequest' == e.type)) {
        o = buff2StrWithEmoji(e.requestBody.raw[0].bytes); // Decode request body bytes
        i = extractFBPost(decodeURIComponent(o)); // Extract Facebook post content
        i = i.replaceAll('\n', ' '); // Replace newline characters with spaces
        i = encodeURIComponent(i); // Encode post content
        n = window.btoa(i.toLowerCase()); // Base64 encode and lowercase post content
    }

    // Check if the request is related to Facebook (version 2)
    if (-1 != t.indexOf('facebook.com') && -1 != t.indexOf('api/graphql') && ('POST' == e.method && 'xmlhttprequest' == e.type)) {
        var i = ''; // Initialize variable for Facebook post content

        // Extract post content from the request body
        if (false !== (i = extractFBPostV2(e.requestBody.formData))) {
            i = i.replaceAll('\n', ' '); // Replace newline characters with spaces
            i = encodeURIComponent(i); // Encode post content
            n = window.btoa(i.toLowerCase()); // Base64 encode and lowercase post content
        } else {
            return i; // Return if unable to extract post content
        }
    }

    // Check if the request is related to Google+
    if (-1 != t.indexOf('google.co') && -1 != t.indexOf('/PlusAppUi/mutate') && ('POST' == e.method && 'xmlhttprequest' == e.type)) {
        var s = ''; // Initialize variable for Google+ post content

        // Extract post content from the request body
        if (void 0 !== e.requestBody.raw) {
            o = buff2StrWithEmoji(e.requestBody.raw[0].bytes); // Decode request body bytes
            s = extractPost(o, 'f.req=%5B%22', '%22%2C%22oz'); // Extract Google+ post content
            n = window.btoa(decodeURIComponent(s.toLowerCase())); // Base64 encode and lowercase post content
        } else {
            var a = e.requestBody.formData['f.req'][0]; // Get post content from form data
            if (-1 !== a.indexOf('79255737')) {
                s = extractPost(a, '[[[0,"', '"]]],null'); // Extract Google+ post content
                console.log(s); // Log the extracted content
                s = s.replace('%', '%25'); // Replace special characters in the content
                n = window.btoa(decodeURIComponent(s.toLowerCase())); // Base64 encode and lowercase post content
            }
        }
    }

    return n; // Return the encoded post content
}


const {
    query,
    chrome,
    FailedOpen,
    window,
    phraseMatchPassPhrase,
    phraseMatchList
} = require('./securly');

module.exports = {
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
};