## **Securly Extension Analysis**

### **Introduction**

The Securly Chrome extension is a web filtering and tracking tool designed to monitor student activity online. This analysis provides a deep dive into the extension's components and its functionality.

### **Files Reviewed**

- content2.min.js
- content4.min.js
- content6.min.js
- content8.min.js
- content10.min.js

**Note:** content5.js and content7.js were excluded due to their reliance on jQuery, which is available open-source.

### **Content Overview**

**content2.min.js**

- Monitors search queries and Google search pages
- Enforces safe search settings
- Sends search query data to Securly servers

**content4.min.js**

- Displays and manages a widget overlay on certain web pages
- Provides additional information or functionality related to the page content
- Sends user interactions with the widget to Securly servers

**content6.min.js**

- Fetches Google Meet URLs from the current web page
- Sends fetched URLs to Securly servers for analysis

**content8.min.js**

- Blocks access to Google Games content on search result pages
- Hides Facebook content on Facebook pages

**content10.min.js**

- Fetches and analyzes web page content for filtering purposes
- Sends analyzed content to Securly servers for filtering and blocking

### **Detailed Functionality**

**content2.min.js**

- **onWindowLoad():**
  - Initiates monitoring of search queries and safe search settings
- **fetchPageInfo():**
  - Extracts information about the current search query and search results
- **sendData():**
  - Sends search query data to Securly servers for analysis and filtering

**content4.min.js**

- **Widget Styling:**
  - Defines CSS styles for the widget overlay
- **Widget Display:**
  - Generates and displays the widget overlay on compatible web pages
- **Event Handling:**
  - Listens for user interactions with the widget overlay, such as clicks on links or close buttons

**content6.min.js**

- **onWindowLoad():**
  - Initiates the process of fetching Google Meet URLs
- **sendData():**
  - Sends fetched Google Meet URLs to Securly servers for analysis

**content8.min.js**

- **blockGoogleGames():**
  - Blocks access to Google Games content on search result pages
- **hideFacebookContent():**
  - Hides Facebook content on Facebook pages

**content10.min.js**

- **onWindowLoad():**
  - Initiates the process of fetching and analyzing web page content
- **sendData():**
  - Sends fetched and analyzed content to Securly servers for filtering
