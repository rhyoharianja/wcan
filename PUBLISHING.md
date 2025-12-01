# Publishing Guide

This guide outlines the steps to publish the `wcan` package to NPM and create a GitHub release.

## Prerequisites

- You must have an NPM account.
- You must be logged in to NPM in your terminal (`npm login`).
- You must have push access to the GitHub repository.

## Steps

### 1. Update Version

Update the version in `package.json` according to semantic versioning (major.minor.patch).

```bash
npm version patch # or minor, or major
```

This command will automatically:
- Update the version in `package.json`.
- Create a git commit with the version number.
- Create a git tag with the version number (e.g., `v1.0.1`).

### 2. Push to GitHub

Push the commit and the new tag to GitHub.

```bash
git push origin main --tags
```

### 3. Publish to NPM

Run the publish command. This will automatically run the `build` script before publishing (due to `prepublishOnly` hook).

```bash
npm publish --access public
```

### 4. Create GitHub Release (Optional but Recommended)

1. Go to [https://github.com/rhyoharianja/wcan/releases](https://github.com/rhyoharianja/wcan/releases).
2. Click "Draft a new release".
3. Choose the tag you just pushed (e.g., `v1.0.1`).
4. Generate release notes or write a description of the changes.
5. Click "Publish release".

## Verification

After publishing, you can verify the package on NPM:
[https://www.npmjs.com/package/wcan](https://www.npmjs.com/package/wcan)
