# File: content.min.js

### Overview:
This script is intended to interact with YouTube pages, sending data about the current page to the Chrome runtime. It also processes actions based on responses received from the runtime.

### Variables:
- `port`: Connection to the Chrome runtime.
- `window.onscroll`: Event listener for window scroll.
- `prevUrl`: Stores the previous URL.
- `prevTitle`: Stores the previous title of the webpage.
- `title`: Represents the title element of the document.
- `observer`: MutationObserver instance to observe changes in the title.
- `window.ytdBrowse`: Represents the ytd-browse element.
- `window.lastUpdateBrowse`: Stores the timestamp of the last update on ytd-browse.
- `window.lastResponse`: Stores the last response received from the Chrome runtime.

### Functions:
- `onWindowLoad()`: Entry point function executed when the window loads.
- `fetchPageInfo(embedded, html)`: Fetches information about the current page.
- `sendData(data)`: Sends data to the Chrome runtime.
- `sendOptionsRequest()`: Sends a request for YouTube options to the Chrome runtime.
- `processActions(response)`: Processes actions based on responses from the Chrome runtime.
- `hideComment()`: Hides comments section.
- `hideThumbnails()`: Hides thumbnails and playlist thumbnails.
- `hideSidebar()`: Hides the sidebar.
- `hideRecommended()`: Placeholder function for hiding recommended videos.
- `onWindowScroll()`: Function triggered on window scroll.
- `callWindowLoadWithTimeOut()`: Calls `onWindowLoad()` with a delay.

### Observing Title Changes:
The script observes changes in the title element using a MutationObserver. Whenever the title changes, it updates `prevTitle` and reloads the page if it's not a search results page.

### Dependencies:
- This script relies on the Chrome runtime API for message passing.
- It also utilizes MutationObserver API to monitor changes in the title element.
