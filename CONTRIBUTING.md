# Contributing to Emprios Website

Welcome! This guide is for developers and moderators who want to contribute to the code.

## 🚀 Getting Started

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/Soumit1k05/Emprios-website.git
    cd Emprios-website
    ```
2.  **Install Dependencies**:
    From the root directory, run:
    ```bash
    npm run install-all
    ```
3.  **Setup Environment Variables**:
    -   Copy `be/.env.example` to `be/.env` and fill in your MongoDB URI.
4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 🛠 For Moderators: Updating Content

If you need to update bundles, pricing, or site metadata, you don't need to touch the main logic.
Simply edit `fe/src/config/content.js`.

-   **Adding/Editing Bundles**: Locate the `bundlesContent` array and modify the fields.
-   **Changing Site Info**: Locate the `siteMetadata` object.

## ✅ Before Pushing

To ensure the code is "error-free" and will be accepted by CI/CD:

1.  **Build Check**:
    ```bash
    cd fe && npm run build
    ```
2.  **Commit Guidelines**:
    Ensure your commit messages are descriptive.
3.  **No Direct Push to `main`**:
    Always create a new branch: `git checkout -b feature/your-feature-name`.

## 🛡 Code of Conduct

Always ensure that any code or content pushed aligns with the brand guidelines of EMPRIOS.
