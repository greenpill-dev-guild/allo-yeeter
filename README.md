# allo-yeeter
Repo holding code for client and contract for Allo Yeeter RFP making a simple tool to distribute funds built on top of Allo.

## Project Structure
This is a monorepo project managed with Turborepo and Bun as the package manager.

## Prerequisites

- Node.js (version 20 or later)
- Bun (version 1.1.20 or later)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/greenpill-dev-guild/allo-yeeter.git
   cd allo-yeeter
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Build the kit package:
   ```
   bun run build:kit
   ```

## Available Scripts

- `bun run dev`: Start the development server for all apps
- `bun run build`: Build all apps and packages
- `bun run lint`: Run linting for all apps and packages
- `bun run format`: Format all files using Prettier
- `bun run dev:demo`: Start the development server for the demo app

## Workspace Structure

This monorepo contains the following workspaces:
- `apps/*`: Application projects
- `packages/*`: Shared packages

## Development Workflow

1. Run `bun run build:kit` to build the shared kit package.
2. Use `bun run dev` to start development servers for all apps, or `bun run dev:demo` for the demo app specifically.

## Additional Information

- This project uses Turborepo for task running and caching. Check `turbo.json` for task configurations.
- The project is set up to use environment variables. Make sure to set up your `.env.*local` files as needed.
- For more detailed information about each app or package, refer to their respective README files in the workspace directories.

## Project Repository

You can find the project repository at: [https://github.com/greenpill-dev-guild/allo-yeeter](https://github.com/greenpill-dev-guild/allo-yeeter)
