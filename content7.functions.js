const {
    utils0
} = require('./content7');

function bindEvents(element, eventType, selector, data, handler, one) {
    var eventTypeType = typeof eventType;
    if (eventTypeType === 'object') {
        for (var key in eventType) {
            bindEvents(element, key, data, handler, eventType[key], one);
        }
        return element;
    }

    if (data == null && handler == null) {
        handler = selector;
        data = selector = undefined;
    } else if (handler == null) {
        if (typeof selector === 'string') {
            handler = data;
            data = undefined;
        } else {
            handler = data;
            data = selector;
            selector = undefined;
        }
    }

    if (handler === false) {
        handler = returnFalse;
    } else if (!handler) {
        return element;
    }

    if (one === 1) {
        var originalHandler = handler;
        handler = function (event) {
            utils0(this).off(event);
            return originalHandler.apply(this, arguments);
        };
        handler.guid = originalHandler.guid || (originalHandler.guid = utils0.guid++);
    }

    return element.each(function () {
        utils0.event.add(this, eventType, handler, data, selector);
    });
}

function setCurrentTimeAsTimeout() {
    // Clear the previous timeout if any
    clearTimeout(previousTimeout);
    // Set a new timeout to reset a global variable 'lastTime'
    previousTimeout = setTimeout(function () {
        lastTime = undefined;
    });
    // Return the current time in milliseconds
    return lastTime = Date.now();
}

function createSizeObject(size, includeOpacityAndWidth) {
    var sizeProperties = { height: size },
        propertySuffix,
        sideIndex = 0,
        sides = ['Top', 'Right', 'Bottom', 'Left'];

    // Loop to set padding and margin for all four sides
    for (; sideIndex < 4; sideIndex += 2 - includeOpacityAndWidth ? 1 : 0) {
        propertySuffix = sides[sideIndex];
        // Set both margin and padding for each side
        sizeProperties['margin' + propertySuffix] = sizeProperties['padding' + propertySuffix] = size;
    }

    // If includeOpacityAndWidth flag is true, set opacity and width as well
    if (includeOpacityAndWidth) {
        sizeProperties.opacity = sizeProperties.width = size;
    }

    return sizeProperties;
}

module.exports = {
    bindEvents,
    setCurrentTimeAsTimeout,
    createSizeObject
};