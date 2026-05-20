# Project Structure: LandSafe Pro

This document outlines the directory structure and the purpose of each file in the LandSafe Pro project.

## Root Directory
- `.env.example`: Template for environment variables (API keys, secrets).
- `components.json`: Configuration for shadcn/ui components.
- `db.json`: Local file-based database for storing users and document data.
- `index.html`: The main entry point for the frontend application.
- `metadata.json`: App meta-data (name, description, permissions).
- `package.json`: Project dependencies and scripts (dev, build, start).
- `server.ts`: Full-stack Express backend handling Auth, AI Analysis, and API routes.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration for the React frontend.

## Source Directory (`/src`)
- `App.tsx`: Main application component with routing and state management.
- `index.css`: Global styles including Tailwind CSS imports.
- `main.tsx`: React entry point.

### Components (`/src/components`)
- `Navbar.tsx`: Global navigation bar with user status.
- `Auth.tsx`: Landing page with Hero sections and Login/Register forms.
- `Dashboard.tsx`: User profile and document history view.
- `DocumentUpload.tsx`: AI-powered document scanning interface.
- `AdminPanel.tsx`: Administrative view for monitoring system stats.

### UI Components (`/src/components/ui`)
Reusable base components powered by shadcn/ui:
- `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `sonner.tsx`, `table.tsx`, `tabs.tsx`.

### Libraries (`/src/lib`)
- `utils.ts`: Helper functions (e.g., Tailwind class merging).
