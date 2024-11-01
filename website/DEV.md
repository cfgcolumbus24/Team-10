# Local Development Setup Guide for Next.js Project

## Prerequisites

### 1. Node.js Installation

#### Windows

1. Download the LTS version of Node.js from [nodejs.org](https://nodejs.org)
2. Run the installer and follow the installation wizard
3. Verify installation by opening Command Prompt and running:

    ```bash
    node --version
    npm --version
    ```

#### macOS

1. Using Homebrew (recommended):

    ```bash
    brew install node
    ```

2. Or download the LTS version from [nodejs.org](https://nodejs.org)
3. Verify installation:

    ```bash
    node --version
    npm --version
    ```

#### Linux (Ubuntu/Debian)

```bash
curl -fsSL <https://deb.nodesource.com/setup_20.x> | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Code Editor

- Install [Visual Studio Code](https://code.visualstudio.com/) (recommended)
- Recommended extensions:
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets

## Project Setup

1. Clone the repository:

    ```bash
    git clone [repository-url]
    cd [project-name]
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env.local` file in the root directory:

    ```bash
    cp .env.example .env.local
    ```

  Fill in the required environment variables.

## Running the Project

### Development Mode

```bash
npm run dev
```

- Access the application at `http://localhost:3000`
- Changes will hot-reload automatically

### Build for Production

```bash
npm run build
npm start
```

## Common Issues and Solutions

### Node Version Mismatch

If you see node version errors:

1. Install [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
2. Install and use the correct Node version:

    ```bash
    nvm install
    nvm use
    ```

### Port Already in Use

If port 3000 is already in use:

1. Kill the process using the port:

   - Windows:

       ```bash
       netstat -ano | findstr :3000
       ```

   - Mac/Linux:

       ```bash
       lsof -i :3000
       ```

2. Or change the port:

  ```bash
  npm run dev -- -p 3001
  ```

### Module Not Found Errors

If you encounter module not found errors:

1. Delete `node_modules` and package-lock.json:

    ```bash
    rm -rf node_modules package-lock.json
    ```

2. Clear npm cache:

    ```bash
    npm cache clean --force
    ```

3. Reinstall dependencies:

    ```bash
    npm install
    ```

## Development Tools

### Linting

- Run ESLint:

    ```bash
    npm run lint
    ```

- Fix auto-fixable issues:

    ```bash
    npm run lint:fix
    ```

### Testing

- Run tests:

    ```bash
    npm test
    ```

- Run tests in watch mode:

    ```bash
    npm run test:watch
    ```

## Git Workflow

1. Create a new branch:

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. Make your changes and commit:

    ```bash
    git add .
    git commit -m "descriptive commit message"
    ```

3. Push changes:

    ```bash
    git push origin feature/your-feature-name
    ```

4. Create a Pull Request through the repository's web interface

## Need Help?

- Check the project documentation in the `docs` folder
- Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Contact the team lead for access issues
