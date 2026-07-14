# CI/CD Workflow Explanation

This document details the continuous integration workflow configured for the Task Manager project.

## Workflow Triggers
The workflow executes automatically under the following conditions:
- A code push event occurs targeting the `main` branch.
- A pull request is created or updated targeting the `main` branch.

## Execution Steps

### Job Environment
- Runs on a virtual host machine using the `ubuntu-latest` operating system container.

### Step Breakdown
1. **Checkout Code**: Imports the repository source code to the runner using `actions/checkout@v3`.
2. **Setup Node.js**: Configures the environment to use Node.js version 18 using `actions/setup-node@v3`.
3. **Install Dependencies**: Navigates into the `/frontend` directory and executes `npm install`.
4. **Run Lint**: Executes `npm run lint` inside the `/frontend` folder to validate code styling rules and verify code quality metrics.
