# HBIVentures Website

Production-ready multi-page website for HBIVentures, built with Next.js and configured for Vercel.

## Publish with GitHub and Vercel

1. Create a new empty GitHub repository.
2. Upload every file and folder from this package to the repository root.
3. In Vercel, choose **Add New → Project** and import the GitHub repository.
4. Leave the detected framework as **Next.js** and select **Deploy**.
5. After deployment, add `hbiventures.com` and `www.hbiventures.com` under the project’s Domains settings.
6. Update the domain’s DNS records using the values Vercel provides.

The included `vercel.json` and package scripts already contain the correct build settings.

## Pages

- Home
- About
- HBI STEAM Academy
- HBI Innovation Foundry
- HBI Foundation
- Innovation Portfolio
- Partner Network
- Contact

## Contact form

The contact form prepares a complete email to `info@hbiventures.com` in the visitor’s email application. It does not require PHP, a database, or additional Vercel configuration.

## Local preview

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
