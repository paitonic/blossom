# Privacy Policy

## Introduction
Blossom is a browser extension designed to help developers track their work on GitHub. This policy explains what data is collected, how it is used, and how it is stored.

## Data Collection
The following types of information is collected strictly for the purpose of the extension's functionality:

1.  **GitHub Metadata:** When you open the Blossom form on a GitHub Pull Request page, Blossom automatically retrieve the following public information from the page:
    *   Pull Request Title
    *   Repository Name
    *   Repository Owner/Organization
    *   Pull Request ID
    *   Creation Date
2.  **User-Generated Content:** The data you explicitly enter into the extension:
    *   PR ratings (Challenge, Effort, Impact, Sentiment)
    *   Tags
    *   Personal notes

## Data Storage
**All data is stored locally on your device.**
*   Blossom use the browser's local storage API (`chrome.storage.local`) to save your journal entries.
*   Blossom **do not** have any external servers.
*   Blossom **do not** transmit your data to any third-party services or analytics providers.
*   Your data never leaves your browser unless you explicitly choose to export it.

## Data Usage
The collected data is used exclusively to:
*   Populate your personal work journal.
*   Generate personal statistics and visualizations in the extension's dashboard.

## Permissions
The extension requests the following permissions for specific purposes:

*   **`storage`:** Required to save your journal entries locally on your device.
*   **`host_permissions` (`https://github.com/*`):** Required to inject the "Blossom" button into GitHub Pull Request pages and to read the PR metadata (title, date) needed for your journal entry.
*   **`downloads` (Optional):** Required only if you choose to export your data to a JSON file for backup purposes.

## Data Control
You have full control over your data:
*   **Access:** You can view all your stored data via the extension's dashboard.
*   **Export:** You can export your data to a JSON file via the Settings tab.
*   **Import:** You can restore data from a previously exported JSON file.
*   **Deletion:** Uninstalling the extension will permanently delete all data stored by Blossom from your browser.

## Changes to This Policy
This privacy policy may be updated to reflect changes. The latest version will always be available in Blossom's GitHub repository.

## Contact
If you have questions about this policy, please open an issue in Blossom's [GitHub repository](https://github.com/paitonic/blossom).
