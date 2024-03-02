(function () {
    var styleElement, targetElement, widgetHtml, widgetLinks, t = false;

    // Function to escape HTML entities
    var escapeHtml = function (str) {
        return new DOMParser().parseFromString(str, 'text/html').body.textContent
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;');
    };

    // Function to remove widget
    var removeWidget = function () {
        styleElement.remove();
        document.removeEventListener('click', handleWidgetClick);
        console.log('widget removed');
    };

    // Function to handle click on widget
    var handleWidgetClick = function (event) {
        if (event.target.nodeName.toLowerCase() === 'span' &&
            event.target.parentElement.className.includes('well-path-widget-link-wrap')) {
            console.log('cta clicked');
            window.open(event.target.dataset.href);
            chrome.runtime.sendMessage({
                source: 'well-path-widget',
                action: 'ctaClicked',
                label: event.target.innerText,
                link: event.target.dataset.href.replace('mailto:', ''),
            });
            removeWidget();
        }
        if (event.target.nodeName.toLowerCase() === 'img' &&
            event.target.parentElement.className.includes('well-path-widget-close')) {
            console.log('close button clicked');
            chrome.runtime.sendMessage({
                source: 'well-path-widget',
                action: 'closed',
            });
            removeWidget();
        }
    };

    // Check if not on securly.com, then execute widget logic
    if (window.location.href.indexOf('securly.com') === -1) {
        (function () {
            chrome.runtime.onMessage.addListener((message, sender) => {
                console.debug('wpw msg received', message, sender);
                if (typeof message === 'object' && message.action && message.source === 'well-path-widget') {
                    switch (message.action) {
                        case 'display':
                            if (!message.data || t) {
                                return;
                            }
                            (function (data) {
                                styleElement = document.createElement('style');
                                styleElement.textContent = `
                                    .well-path-widget-wrapper {
                                        position: fixed;
                                        top: 0;
                                        left: 0;
                                        z-index: 2147483647;
                                        z-index: 2147483648;
                                        background-color: #ffffff;
                                        width: 100%;
                                        font-size: 13px;
                                        font-family: Arial;
                                        color: #333333;
                                        display: block;
                                        box-shadow: 0 2px 3px 0 #dbe6f0;
                                    }

                                    .well-path-widget-wrapper div {
                                        display: block;
                                    }

                                    /* Additional styles omitted for brevity */
                                `;
                                document.head.appendChild(styleElement);

                                widgetLinks = '';
                                var linkHtml = '';
                                for (var i = 0; i < data.links.length; i++) {
                                    var link = data.links[i];
                                    var href = link.email ? 'mailto:' + escapeHtml(link.email) : escapeHtml(link.url);
                                    linkHtml += `
                                        <div class="well-path-widget-link-wrap">
                                            <span data-href="${href}">${escapeHtml(link.label)}</span>
                                        </div>
                                    `;
                                    if ((i + 1) % 2 === 0) {
                                        widgetLinks += `
                                            <div class="well-path-widget-link-row">${linkHtml}</div>
                                        `;
                                        linkHtml = '';
                                    }
                                }
                                if (linkHtml) {
                                    widgetLinks += `
                                        <div class="well-path-widget-link-row">${linkHtml}</div>
                                    `;
                                }

                                widgetHtml = `
                                    <div class="well-path-widget">
                                        <div class="well-path-widget-row">
                                            <div class="well-path-widget-header">${escapeHtml(data.header)}</div>
                                            <div class="well-path-widget-close">
                                                <img src="${chrome.extension.getURL('icon-16-px-close.svg')}" />
                                            </div>
                                        </div>
                                        <div class="well-path-widget-row">
                                            <div class="well-path-widget-body">${escapeHtml(data.body)}</div>
                                            <div class="well-path-widget-links">${widgetLinks}</div>
                                        </div>
                                    </div>
                                `;
                                targetElement = document.createElement('div');
                                targetElement.className = 'well-path-widget-wrapper';
                                targetElement.innerHTML = widgetHtml;
                                document.body.appendChild(targetElement);
                                document.body.insertBefore(targetElement, document.body.firstChild);
                                console.log('widget displayed');
                                t = true;
                                document.addEventListener('click', handleWidgetClick);
                            })(message.data);
                            break;
                        case 'remove':
                            removeWidget();
                    }
                }
            });

            chrome.runtime.sendMessage({
                source: 'well-path-widget',
                action: 'ready',
            });

            var linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = chrome.extension.getURL('fonts/Metropolis.css');
            document.head.appendChild(linkElement);
        })();
    }
})();
