This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Setting up a new client

This project is built to be cloned per client. After forking the repo:

1. Update the code-level branding in `lib/site.ts` (site name, tagline, URL) and `lib/services.tsx` (services list).
2. Set up `.env.local` (see `.env.local.example`) pointing at the new client's MongoDB database.
3. Copy `client.config.example.mjs` to `client.config.mjs`, fill in their contact info, theme colors, loading screen, etc.
4. Run `npm run seed` to write those values into the database as initial settings.
5. Start the app and log in at `/admin/login` — the first account created becomes the super-admin.
6. Use the admin panel to upload the logo, hero images, gallery images, etc.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
