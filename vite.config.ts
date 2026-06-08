import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Actions, GITHUB_REPOSITORY is "owner/repo-name".
// We extract the repo name to set the correct base path for GitHub Pages.
// Locally it stays '/' so the dev server works without changes.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  plugins: [react()],
  base: repoName ? `/${repoName}/` : '/',
})
