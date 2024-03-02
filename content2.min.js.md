# File: content2.min.js

### Overview:
This script is designed to monitor changes in the title of the webpage. Whenever the title changes, it sends the updated URL to the Chrome runtime.

### Variables:
- `port`: Connection to the Chrome runtime.
- `prevUrl`: Stores the previous URL.
- `prevTitle`: Stores the previous title of the webpage.
- `title`: Represents the title element of the document.
- `observer`: MutationObserver instance to observe changes in the title.

### Functions:
- `sendData(url)`: Sends the URL to the Chrome runtime if it has changed.
- `fetchURL()`: Fetches the current URL after a delay and sends it to the Chrome runtime.
- `sleep(milliseconds)`: Introduces a delay using Promises.

### Observing Title Changes:
The script observes changes in the title element using a MutationObserver. Whenever the title changes, it updates `prevTitle` and calls `fetchURL()` to send the updated URL to the Chrome runtime.

### Dependencies:
- This script relies on the Chrome runtime API for message passing.
- It also utilizes the MutationObserver API to monitor changes in the title element.
