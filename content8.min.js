// Function to block Google Games elements
function blockGoogleGames() {
    var styleElement, targetElement;

    // Block Google Games on search page
    if (
        document.location.pathname.includes('search') &&
        document.querySelectorAll('block-component div[data-parent-funbox]').length !== 0
    ) {
        styleElement = document.createElement('style');
        styleElement.innerHTML = 'block-component { display: none; }';
        document.head.appendChild(styleElement);
        targetElement = document.querySelector('block-component');
        targetElement.parentElement.removeChild(targetElement);
    }

    // Block Google Games on fbx page
    if (document.location.pathname.includes('fbx')) {
        styleElement = document.createElement('style');
        styleElement.innerHTML = 'body > div { display: none; }';
        document.head.appendChild(styleElement);
        targetElement = document.querySelector('body > div');
        targetElement.parentElement.removeChild(targetElement);
    }
}

// Check if document is already loaded, then block Google Games, otherwise wait for DOMContentLoaded event
if (document.readyState !== 'loading') {
    blockGoogleGames();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        blockGoogleGames();
    });
}
