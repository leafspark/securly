# securly
Reverse engineering the Securly extension, a web filtering and tracking extension designed for Chrome to monitor students.

Please note that some files are removed or redacted becuase of copyright concerns.

### Securly Chrome Extension Files

#### Before you start

content5.js and content7.js are not included because they appear to be a custom implementation of jQuery, which I will not spend time to reverse engineer because the source code is avaliable at:
[https://jquery.com/download](https://jquery.com/download/)

#### content.min.js
- **Purpose**: This script is responsible for monitoring user activity on web pages and sending relevant data to the Securly servers for analysis and filtering.
- **Components**:
  - `onWindowLoad()`: Function executed when the window loads, initiates monitoring of user activity.
  - `fetchPageInfo()`: Extracts information about the current web page, such as video ID and channel ID.
  - `sendData()`: Sends data about the current web page to the Securly servers.
- **Usage**:
  - Monitors user interactions on YouTube pages.
  - Extracts video and channel IDs for tracking purposes.
  - Sends data to the Securly servers for analysis and filtering.

#### content2.min.js
- **Purpose**: Handles interactions with Google search pages to enforce safe search settings and monitor search queries.
- **Components**:
  - `onWindowLoad()`: Function executed when the window loads, initiates monitoring of search queries and safe search settings.
  - `fetchPageInfo()`: Extracts information about the current search query and search results.
  - `sendData()`: Sends search query data to the Securly servers for analysis and filtering.
- **Usage**:
  - Monitors search queries and search results on Google search pages.
  - Enforces safe search settings to filter out explicit content.
  - Sends search query data to the Securly servers for analysis and filtering.

#### content4.min.js
- **Purpose**: Handles interactions with web pages to display and manage a widget overlay for specific content.
- **Components**:
  - Widget Styling: Defines CSS styles for the widget overlay.
  - Widget Display: Dynamically generates and displays the widget overlay on compatible web pages.
  - Event Handling: Listens for user interactions with the widget overlay, such as clicks on links or close buttons.
- **Usage**:
  - Displays a widget overlay on compatible web pages.
  - Provides additional information or functionality related to the content on the page.
  - Sends user interactions with the widget overlay to the Securly servers for analysis.

#### content6.min.js
- **Purpose**: Connects to the Securly servers to fetch Google Meet URLs from the current web page.
- **Components**:
  - `onWindowLoad()`: Function executed when the window loads, initiates the process of fetching Google Meet URLs.
  - `sendData()`: Sends fetched Google Meet URLs to the Securly servers for analysis.
- **Usage**:
  - Fetches Google Meet URLs from the current web page.
  - Sends fetched URLs to the Securly servers for analysis and filtering.

#### content8.min.js
- **Purpose**: Blocks access to Google Games and Facebook content on search result pages and Facebook pages.
- **Components**:
  - `blockGoogleGames()`: Blocks access to Google Games content on search result pages.
  - `hideFacebookContent()`: Hides Facebook content on Facebook pages.
- **Usage**:
  - Blocks access to specific types of content on Google search result pages.
  - Hides Facebook content on Facebook pages.

#### content10.min.js
- **Purpose**: Connects to the Securly servers to fetch and analyze content from web pages for filtering purposes.
- **Components**:
  - `onWindowLoad()`: Function executed when the window loads, initiates the process of fetching and analyzing web page content.
  - `sendData()`: Sends fetched and analyzed content to the Securly servers for filtering.
- **Usage**:
  - Fetches and analyzes web page content for filtering purposes.
  - Sends analyzed content to the Securly servers for filtering and blocking.
