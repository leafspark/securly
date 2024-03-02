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
function getBlockUrl(e, t, n, o, r) {
    var i = 'domainblockedforuser', s = '';
    'GL' == e && (i = 'GEO');
    '-1' != n && (i = 'safesearch', s = window.btoa(n));
    var a = '';
    if ('BL' != t && 'BL_SRCH' != t && 'WL' != t && 'WL_SRCH' != t || (a = t), 'BL' != t && 'BL_SRCH' != t || (i = 'G' == e ? 'globalblacklist' : 'policyblacklist', t = 'BL'), 'WL' != t && 'WL_SRCH' != t || (i = 'whitelistonly', t = 'WL'), 'BANNED' == t && (i = 'banned'), 'unknown' != window.clusterUrl) {
        var c = window.atob(o), l = c.substr(c.indexOf('://') + 3);
        o = window.btoa(l);
        var d = '';
        return d = window.clusterUrl.replace('/crextn', '') + '/blocked?useremail=' + window.userEmail + '&reason=' + i + '&categoryid=' + t + '&policyid=' + e + '&keyword=' + s + '&url=' + o + '&ver=' + window.version + (1 == r ? '&subFrame=1' : '') + '&extension_id=' + chrome.runtime.id, window.geoLat && window.geoLng && (d += '&lat=' + window.geoLat + '&lng=' + window.geoLng), a && (d += '&listType=' + a), d;
    }
}
function takeDenyActionTabs(e, t, n, o, r, i, s) {
    invalidateSkipListCaching(o, false);
    clearWebCache(o);
    window.brokredRequest = [];
    var a = 'domainblockedforuser', c = '';
    'GL' == e && (a = 'GEO');
    '-1' != n && (a = 'safesearch', c = window.btoa(n));
    var l = '';
    if ('BL' != t && 'BL_SRCH' != t && 'WL' != t && 'WL_SRCH' != t || (l = t), 'BL' != t && 'BL_SRCH' != t || (a = 'G' == e ? 'globalblacklist' : 'policyblacklist', t = 'BL'), 'BANNED' == t && (a = 'banned'), 'WL' != t && 'WL_SRCH' != t || (a = 'whitelistonly', t = 'WL'), 'unknown' != window.clusterUrl) {
        var d = window.atob(o), u = d.substr(d.indexOf('://') + 3);
        o = window.btoa(u);
        var h = window.clusterUrl.replace('/crextn', ''), f = window.userEmail, w = '';
        return w = h + '/blocked?useremail=' + f + '&reason=' + a + '&categoryid=' + t + '&policyid=' + e + '&keyword=' + c + '&url=' + o + '&ver=' + window.version + (1 == i ? '&subFrame=1' : '') + '&extension_id=' + chrome.runtime.id, window.geoLat && window.geoLng && (w += '&lat=' + window.geoLat + '&lng=' + window.geoLng), l && (w += '&listType=' + l), void 0 !== s && s && (w += '&rebroker=1'), void isBlockingInProgress(r, 'http://' + window.atob(o)).then(function (e) {
            e || setBlockedPage(r, w);
        }).catch(function (e) {
            console.log('exception in checking blocking progress', r);
            setBlockedPage(r, w);
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
function isBlockingInProgress(e, t) {
    return new Promise(function (n, o) {
        chrome.tabs.get(e, function (e) {
            if (e && 'loading' == e.status) {
                if (urlDetails = new URL(t), 'securly.com' == urlDetails.hostname.replace(/^[^.]+\./g, '') && ('blocked' == urlDetails.pathname || 'blocked.php' == urlDetails.pathname) || 'iheobagjkfklnlikgihanlhcddjoihkg' == urlDetails.hostname && 'blocked.html' == urlDetails.pathname) {
                    return void n(true);
                }
                if (void 0 !== e.pendingUrl && (urlDetails = new URL(e.pendingUrl), 'securly.com' == urlDetails.hostname.replace(/^[^.]+\./g, '') && ('blocked' == urlDetails.pathname || 'blocked.php' == urlDetails.pathname) || 'iheobagjkfklnlikgihanlhcddjoihkg' == urlDetails.hostname && 'blocked.html' == urlDetails.pathname)) {
                    return void n(true);
                }
            }
            n(false);
        });
    });
}
function setBlockedPage(e, t) {
    -1 == e && (e = null);
    e > 0 && (window.tabsBeingBlocked[e] = t, chrome.tabs.get(e, t => {
        0 != t.url.indexOf('chrome') && -1 == t.url.indexOf('securly.com/') && chrome.tabs.executeScript(e, {
            allFrames: true,
            code: 'window.stop(); window.location = \'\';',
            runAt: 'document_start'
        }, function () {
        });
    }));
    chrome.tabs.update(e, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html' }, function () {
        chrome.runtime.lastError;
    });
    chrome.tabs.update(e, { url: t }, function () {
        chrome.runtime.lastError && (console.log('some error while redirecting to blocked page', chrome.runtime.lastError), setTimeout(function () {
            chrome.tabs.update(null, { url: t }, function () {
            });
        }, 500));
    });
}
function getYtSSRequestHeaders(e, t) {
    if (-1 != e.indexOf('/results') || -1 != e.indexOf('/search') || -1 != e.indexOf('/watch')) {
        for (var n = '', o = 0; o < t.length; ++o) {
            if ('Cookie' === t[o].name) {
                n = t[o].value;
                t.splice(o, 1);
                break;
            }
        }
        if ('' == n) {
            t.push({
                name: 'Cookie',
                value: 'PREF=f2=8000000'
            });
        } else {
            var r = 0, i = n.split('; ');
            for (o = 0; o < i.length; ++o) {
                -1 != i[o].indexOf('PREF') && (-1 == i[o].indexOf('f2=8000000') && (i[o] += '&f2=8000000'), r = 1);
                -1 != i[o].indexOf('SID=') && (i[o] = '');
            }
            0 == r && i.push('PREF=f2=8000000');
            var s = '';
            for (o = 0; o < i.length; ++o) {
                s += i[o];
                s += '; ';
            }
            s = s.substring(0, s.length - 2);
            t.push({
                name: 'Cookie',
                value: s
            });
        }
    }
    return t;
}
function getPauseAction(e) {
    return invalidateSkipListCaching(e, true), clearWebCache(e), window.brokredRequest = [], 'unknown' == window.clusterUrl ? { cancel: true } : { redirectUrl: window.clusterUrl.replace('/crextn', '') + '/paused' };
}
function takePauseActionTabs(e, t) {
    var n = getPauseAction(e);
    if (void 0 !== n.redirectUrl) {
        var o = n.redirectUrl;
        chrome.tabs.update(t, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html' }, r);
        chrome.tabs.update(t, { url: o }, r);
        setTimeout(function () {
            chrome.tabs.update(null, { url: o }, r);
        }, 500);
    }
    function r() {
        chrome.runtime.lastError;
    }
}
function takeToFailedOpenBlockedPage(e, t, n) {
    var o = btoa(t);
    r = [];
    0 != (Math.pow(2, 3) & n) && r.push('Pornography');
    0 != (Math.pow(2, 4) & n) && r.push('Drugs');
    0 != (Math.pow(2, 5) & n) && r.push('Gambling');
    var r = btoa(r.join(', '));
    window.brokredRequest = [];
    chrome.tabs.update(e, { url: 'chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html?site=' + o + '&category=' + r }, function () {
        chrome.runtime.lastError;
    });
}
function checkSkipListCaching(e) {
    var t = '', n = document.createElement('a');
    n.href = e.url;
    var o = cleanURL(n.hostname.toLowerCase()), r = Math.floor(Date.now() / 1000), i = Object.keys(window.skipList);
    if (i && -1 != i.indexOf(o)) {
        if (t = o, ttlForDomain = window.skipList[o].ttl, lastBrokerCall = window.skipList[o].last_broker_call, -1 == ttlForDomain) {
            return 0;
        }
        if (r - lastBrokerCall < ttlForDomain) {
            return 0;
        }
    }
    for (var s = 0; s < i.length; s++) {
        if (-1 != i[s].indexOf('*')) {
            if (window.skipList[i[s]].regx.test(cleanURL(e.url))) {
                if (t = i[s], ttlForDomain = window.skipList[i[s]].ttl, lastBrokerCall = window.skipList[i[s]].last_broker_call, -1 == ttlForDomain) {
                    return 0;
                }
                if (r - lastBrokerCall < ttlForDomain) {
                    return 0;
                }
            }
        }
    }
    return t.length > 0 && (window.skipList[t].last_broker_call = r), 1;
}
function invalidateSkipListCaching(e, t) {
    url = window.atob(e);
    var n = Object.keys(window.skipList);
    if (t) {
        for (var o = 0; o < n.length; o++) {
            window.skipList[n[o]].last_broker_call = 0;
        }
    } else {
        var r = document.createElement('a');
        r.href = url;
        var i = cleanURL(r.hostname.toLowerCase());
        n && -1 != n.indexOf(i) && (window.skipList[i].last_broker_call = 0);
        for (o = 0; o < n.length; o++) {
            if (-1 != n[o].indexOf('*')) {
                window.skipList[n[o]].regx.test(cleanURL(url)) && (window.skipList[n[o]].last_broker_call = 0);
            }
        }
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
    if ('unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl) {
        var e = createBlockingRequest('get', window.clusterUrl + '/getGeoStatus?ip=1');
        e.onload = function () {
            e.responseText.trim() != window.geoLastIP && (getGeolocation(), window.geoLastIP = e.responseText.trim());
        };
        try {
            e.send();
        } catch (e) {
            console.log('Geolocation remote IP request error.');
        }
    }
}
function getVersion(e) {
    var t = createBlockingRequest('GET', 'manifest.json');
    t.onload = function (e) {
        var n = JSON.parse(t.responseText);
        window.version = n.version;
    };
    try {
        t.send();
    } catch (e) {
        console.log('Send error u2');
    }
}
function getQueryVariable(e, t) {
    var n = document.createElement('a');
    n.href = e;
    for (var o = n.search.replace(/\?/, '').split('&'), r = 0; r < o.length; r++) {
        var i = o[r].split('=');
        if (decodeURIComponent(i[0]) == t) {
            return decodeURIComponent(i[1]);
        }
    }
    return '';
}
function normalizeHostname(e) {
    var t = e;
    return 0 == e.indexOf('www.') ? t = e.substr(4) : 0 == e.indexOf('m.') && (t = e.substr(2)), t;
}
function extractTranslateHostname(e) {
    var t = 'translate.google.com', n = getQueryVariable(e, 'u');
    if ('' != n) {
        var o = (n = (n = (n = (n = decodeURIComponent(n)).toLowerCase()).replace('http://', '')).replace('https://', '')).indexOf('/');
        t = -1 != o ? n.substr(0, o) : n;
    }
    return t;
}
function sendDebugInfo(e) {
    var t = window.clusterUrl + '/debug', n = new XMLHttpRequest();
    n.open('POST', t);
    n.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    try {
        n.send(JSON.stringify(e));
    } catch (e) {
        console.log('Send error u3');
    }
}
function checkAllLoadedTabs() {
    window.needToReloadTabs = 0;
    chrome.tabs.query({}, function (e) {
        for (var t = 0; t < e.length; t++) {
            -1 == e[t].url.indexOf('securly.com') && (-1 == e[t].url.indexOf('http://') && -1 == e[t].url.indexOf('https://') || chrome.tabs.reload(e[t].id));
        }
    });
}
function clearWebCache(e) {
    var t = new Date().getTime() - 300000;
    chrome.browsingData.removeCache({ since: t }, function () {
        chrome.runtime.lastError;
    });
    try {
        var n = window.atob(e), o = new URL(n).hostname.replace('www.', '');
        chrome.browsingData.remove({
            origins: [
                'https://' + o,
                'https://www.' + o
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
        });
    } catch (t) {
        console.log('Clearing web cache failed. b64Url' + e);
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
    var request = createNonBlockingRequest('get', 'http://cdn1.securly.com/config.json');

    request.onreadystatechange = function () {
        if (200 == request.status && 4 == request.readyState) {
            if (0 == request.responseText.trim().length) {
                return void (window.skipList = []);
            }

            var config = JSON.parse(request.responseText);

            if (config.skiplist) {
                var skipList = [];

                config.skiplist.forEach(function (entry) {
                    var key = Object.keys(entry)[0];

                    if (key !== undefined && key.trim().length > 0) {
                        skipList[key] = {
                            ttl: entry[key],
                            last_broker_call: 0
                        };

                        if (key.indexOf('*') !== -1) {
                            var regexPattern = key.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/');
                            var regex = new RegExp(regexPattern);
                            skipList[key].regx = regex;
                        }

                        if (window.skipList[key] !== undefined) {
                            skipList[key].last_broker_call = window.skipList[key].last_broker_call;
                        }
                    }
                });

                window.skipList = skipList;
            }

            window.selfharmlist = config.selfharmlist !== undefined ? config.selfharmlist : [];
            window.vectorExpansionRules = config.vectorExpansionRules !== undefined ? config.vectorExpansionRules : {};
            window.bullyPhrases = config.bullyPhrases !== undefined ? decryptPhrases(config.bullyPhrases) : [];
            window.wlBullyPhrases = config.wlBullyPhrases !== undefined ? decryptPhrases(config.wlBullyPhrases) : [];
            window.thinkTwiceSites = config.thinkTwiceSites !== undefined ? config.thinkTwiceSites : [];

            if (config.ttl !== undefined && 1000 * config.ttl !== window.currentConfigTTL) {
                window.currentConfigTTL = 1000 * config.ttl;
                updateTTLForCrextnCacheConfig(window.currentConfigTTL);
            } else if (config.ttl === undefined && window.defaultConfigTTL !== window.currentConfigTTL) {
                window.currentConfigTTL = window.defaultConfigTTL;
                updateTTLForCrextnCacheConfig(window.defaultConfigTTL);
            }

            window.proxyIdentification = config.proxyIdentification !== undefined ? config.proxyIdentification : [];
        }
    };

    request.send();
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

function notifyProxyIdentified(e) {
    if (isClusterURLAvailable() && !identifiedWebsites.includes(e.proxyUrl)) {
        var t = createNonBlockingRequest('post', window.clusterUrl + '/proxy'), n = new FormData();
        n.append('domain', e.proxyUrl);
        n.append('proxyFamily', e.proxyName);
        n.append('rules', JSON.stringify(e.targetElements || e.rules));
        try {
            t.send(n);
            identifiedWebsites.push(e.proxyUrl);
        } catch (e) {
            console.log('identifying proxy failed');
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
function onBeforeRequestListener(e, t = false) {
    var n, o = e.url;
    if ('https://www.pornhub.com/testfiltering' == e.url) {
        return { cancel: true };
    }
    if ('https://swearing.testfiltering.com/' == e.url) {
        return { cancel: true };
    }
    if ('main_frame' == e.type && -1 == e.url.indexOf('securly') && void 0 !== window.tabsBeingBlocked[e.tabId]) {
        return { redirectUrl: window.tabsBeingBlocked[e.tabId] };
    }
    n = o;
    'GET' === e.method && interceptRequest(e);
    'POST' == e.method && interceptRequest(e);
    var r = interceptOrNot(e);
    if ('sub_frame' == e.type && 'file://' == e.initiator && 0 === e.url.indexOf('http') && (r = 1), 1 == r && (r = checkSkipListCaching(e)), 1 != r) {
        window.youtubeLastCheck = null;
        n.indexOf('youtube') && (window.ytURL = n, 'UNKNOWN_SCHOOL' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && (null == window.ytOptionsLastCheck || Math.floor(Date.now() / 1000) - window.ytOptionsLastCheck >= 3600) && getYTOptions(), chrome.runtime.onConnect.addListener(function (t) {
            'yt' == t.name && t.onMessage.addListener(function (o, r) {
                if (window.checkYouTube && n.indexOf('youtube') && 'GET' == e.method && 'getYoutubeOptions' != o.action && 'script' !== e.type && 'stylesheet' !== e.type && 'image' !== e.type) {
                    if (window.youtubeLastCheck = Date.now(), 'unknown' != window.clusterUrl && 'AVOID_OS' != window.clusterUrl && 'UNKNOWN_SCHOOL' != window.clusterUrl && -1 === window.youtubeFrames.indexOf(t.sender.frameId) && (null != o.channelId || null != o.videoId || null != o.category)) {
                        window.youtubeFrames[youtubeFrames.length] = t.sender.frameId;
                        let n = {
                            channelId: o.channelId,
                            videoId: o.videoId,
                            category: o.category
                        }, s = window.btoa(r.sender.url), a = document.createElement('a');
                        a.href = r.sender.url;
                        c = normalizeHostname(c = a.hostname.toLowerCase());
                        let l = '', d = '';
                        if (void 0 !== e.initiator) {
                            var i = new URL(e.initiator);
                            d = window.btoa(i.hostname.toLowerCase());
                        }
                        let u = getRespArrTabs(c, s, l, r.sender.url, r.sender.tab.id, d, o.embedded, this, n), h = u[0], f = u[1];
                        u[2];
                        'DENY' == h ? 0 == o.embedded && chrome.tabs.update(r.sender.tab, takeDenyAction(f, 2, s)) : this.iframeResp.length > 0 && 'DENY' == this.iframeResp[0] && (this.iframeResp = '', t.postMessage({
                            hideRecommended: window.hideRecommended,
                            hideComments: window.hideComments,
                            hideSidebar: window.hideSidebar,
                            hideThumbnails: window.hideThumbnails,
                            checkEmbed: true,
                            action: 'deny',
                            url: this.iframeBlockUrl
                        }));
                    }
                } else {
                    'getYoutubeOptions' == o.action && t.postMessage({
                        hideRecommended: window.hideRecommended,
                        hideComments: window.hideComments,
                        hideSidebar: window.hideSidebar,
                        hideThumbnails: window.hideThumbnails
                    });
                }
            });
        }), chrome.runtime.onConnect.addListener(function (e) {
            'gmaps' == e.name && e.onMessage.addListener(function (e, t) {
                if (e.url != window.lastMapsUrl) {
                    window.lastMapsUrl = e.url;
                    let n = window.btoa(e.url), o = document.createElement('a');
                    o.href = e.url;
                    let r = getRespArrTabs(c = normalizeHostname(c = o.hostname.toLowerCase()), n, '', e.url, t.sender.tab.id, '', false, this), i = r[0], s = r[1];
                    r[2];
                    'DENY' == i && chrome.tabs.update(t.sender.tab, takeDenyAction(s, 2, n));
                }
            });
        }));
    } else {
        var i = '', s = false;
        (l = document.createElement('a')).href = e.initiator;
        i = window.btoa(l.hostname.toLowerCase());
        'sub_frame' == e.type && (i = window.btoa(l.hostname.toLowerCase()), s = true, window.isSubFrame = true, window.brokredRequest = []);
        var a;
        if (n.length > 1000 && (n = n.substring(0, 1000)), a = getSocialPost(e, n), -1 != n.indexOf('youtube.com') && -1 != n.indexOf('youtubei/v1/search') && (n = getYoutubeSearchURL(e, n)), false === a) {
            return;
        }
        var c, l, d = window.btoa(n), u = n.replace(/^(?:https?:\/\/)?/i, '');
        if (u.endsWith('/') && (u = u.slice(0, -1)), window.brokeredArrIndex++, window.brokeredArrIndex >= 20 && (window.brokeredArrIndex = 0), -1 != window.brokredRequest.indexOf(u) && '' === a || (window.brokredRequest[window.brokeredArrIndex] = u), 'translate.google.com' == new URL(n).hostname ? c = extractTranslateHostname(n) : ((l = document.createElement('a')).href = n, c = l.hostname.toLowerCase()), c = normalizeHostname(c), window.geolocation && getRemoteIPGeo(), -1 !== n.indexOf('youtube.') && false === window.checkYouTube || -1 === n.indexOf('youtube.') || e.initiator !== window.refDomain) {
            var h = getRespArrTabs(c, d, a, n, e.tabId, i, s, this, null, t);
        }
        var f = h[0], w = h[1], g = h[2], p = (h[3], h[4], h[5], h[6], ''), m = '';
        if (this.iframeResp.length > 0 && 'DENY' == this.iframeResp[0]) {
            return this.iframeResp = '', { redirectUrl: this.iframeBlockUrl };
        }
        if ('DENY' == f) {
            return takeDenyAction(w, g, d);
        }
        if ('PAUSE' == f) {
            return getPauseAction(d);
        }
        var v = false;
        if ('SS' == f && (false !== (p = takeSafeSearchAction(c, o)) && (o = p), v = true), 'CC' == g && (false !== (m = takeCreativeCommonImageSearchAction(o)) && (o = m), v = true), -1 !== n.indexOf('youtube.') && 'REFWL' == g ? (window.refDomain = e.initiator, window.checkYouTube = false) : -1 !== n.indexOf('youtube.') && (window.checkYouTube = true), true === v) {
            if (-1 !== n.indexOf('google.') && -1 !== n.indexOf('/maps/')) {
                return;
            }
            if (-1 !== n.indexOf('google.')) {
                if (/q=/.test(n)) {
                    if (-1 !== n.indexOf('google.') && -1 === n.indexOf('safe=active') && -1 === n.indexOf('safe=strict')) {
                        return { redirectUrl: o };
                    }
                    if (false === p && false === m) {
                        return;
                    }
                    if (-1 !== n.indexOf('google.') && -1 !== n.indexOf('tbm=isch') && -1 === n.indexOf('tbs=il:cl')) {
                        return { redirectUrl: o };
                    }
                }
            } else {
                if (-1 !== n.indexOf('yahoo.com') && -1 === n.indexOf('imgl=cc') || -1 !== n.indexOf('bing.') && -1 === n.indexOf('qft+filterui:licenseType-Any')) {
                    return { redirectUrl: o };
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

function interceptRequest(e) {
    if (!window.vectorExpansionRules) {
        return;
    }
    var t = Object.keys(window.vectorExpansionRules);
    if (0 == t.length) {
        return;
    }
    var n = document.createElement('a');
    n.href = e.initiator;
    mainHost = cleanURL(n.hostname.toLowerCase());
    -1 != mainHost.indexOf('www.') && (mainHost = mainHost.replace('www.', ''));
    if (t && -1 != t.indexOf(mainHost)) {
        for (let t = 0; t < window.vectorExpansionRules[mainHost].length; t += 1) {
            try {
                const n = window.vectorExpansionRules[mainHost][t];
                let o = n.pattern, r = n.context, i = n.field, s = n.content, a = o.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('/', '\\/'), c = new RegExp(a), l = '';
                c.test(e.url) && ('GET' === e.method ? interceptGetRequest(e, l, mainHost, r, n, i) : 'POST' === e.method && interceptPostRequest(e, mainHost, s, i, r, l, false, n));
            } catch (e) {
            }
        }
    }
}
function interceptPostRequest(e, t, n, o, r, i, s, a) {
    if ('JSON_STR' == n) {
        let n = a.data.split('|').reduce((e, t) => e[t], e);
        if (jsonInfo = JSON.parse(n), Array.isArray(o)) {
            for (let e = 0; e < o.length; e += 1) {
                tempText = removeHTMLTags(o[e].split('|').reduce((e, t) => e[t], jsonInfo));
                i = i.length > 0 ? i + ' ' + tempText : tempText;
            }
        } else {
            i = removeHTMLTags(o.split('|').reduce((e, t) => e[t], jsonInfo));
        }
        if (t.includes('pinterest.')) {
            const e = jsonInfo.options.story_pin;
            e && (parsedTitle = JSON.parse(e).metadata.pin_title, i = i.length > 0 ? i + ' ' + parsedTitle : parsedTitle);
        }
    } else {
        if ('ENCODED_STR' == n) {
            if (buff = e.requestBody.raw[0].bytes, postContent = buff2StrWithEmoji(buff), Array.isArray(o)) {
                for (let e = 0; e < o.length; e += 1) {
                    tempText = o[e].split('|').reduce((e, t) => new URLSearchParams(e).get(t), postContent);
                    i = i.length > 0 ? i + ' ' + tempText : tempText;
                }
            } else {
                i = o.split('|').reduce((e, t) => new URLSearchParams(e).get(t), postContent);
            }
            i = removeHTMLTags('reddit.com' == t ? fetchStringFromJSONObj(JSON.parse(i), 't') : i);
        } else {
            if ('ENCODED' == n) {
                buff = e.requestBody.raw[0].bytes;
                n = buff2StrWithEmoji(buff);
                let r = JSON.parse(n);
                if (Array.isArray(o)) {
                    for (let e = 0; e < o.length; e += 1) {
                        t.includes('tumblr.com') && 'content' == o[e] ? tempText = removeHTMLTags(fetchStringFromJSONObj(r, 'text')) : tempText = removeHTMLTags(o[e].split('|').reduce((e, t) => e[t], r));
                        i = i.length > 0 ? i + ' ' + tempText : tempText;
                    }
                } else {
                    i = removeHTMLTags(o.split('|').reduce((e, t) => -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]], r));
                }
            } else {
                if ('DOUBLE_ENCODED' == n) {
                    buff = e.requestBody.raw[0].bytes;
                    n = buff2StrWithEmoji(buff);
                    let s = JSON.parse(n), a = o.split('||');
                    if ('quora.com' == t && (s && s.queryName && -1 != s.queryName.indexOf('answerCreate') && (r = 'ANSWER'), s && s.queryName && -1 != s.queryName.toLowerCase().indexOf('draft') && true), a.length > 0) {
                        var c = a[0].split('|').reduce((e, t) => e[t], s);
                        if (c) {
                            i = removeHTMLTags(i = fetchStringFromJSONObj(JSON.parse(c), 'text'));
                        }
                    }
                } else {
                    if ('QUERY_PARAM' == n) {
                        i = new Proxy(new URLSearchParams(e.url), { get: (e, t) => e.get(t) })[o];
                    } else {
                        if (Array.isArray(o)) {
                            for (let n = 0; n < o.length; n += 1) {
                                tempText = removeHTMLTags(o[n].split('|').reduce((e, t) => {
                                    try {
                                        return -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]];
                                    } catch (e) {
                                        return '';
                                    }
                                }, e));
                                'reddit.com' == t && -1 != o[n].indexOf('richtext_json') && tempText.length > 0 && (textStr = removeHTMLTags(fetchStringFromJSONObj(JSON.parse(tempText), 't')), captionStr = removeHTMLTags(fetchStringFromJSONObj(JSON.parse(tempText), 'c')), tempText = textStr + ' ' + captionStr);
                                i = i.length > 0 ? i + ' ' + tempText : tempText;
                            }
                        } else {
                            i = removeHTMLTags(o.split('|').reduce((e, t) => -1 == t.indexOf('!') ? e[t] : e[t.split('!')[0]][t.split('!')[1]], e));
                        }
                    }
                }
            }
        }
    }
    i && -1 != i.trim().indexOf(' ') && sendSocialPostToServer(i, t, r, e.url);
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