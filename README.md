This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Pagination
### Approach

Page breaks are calculated by measuring the rendered positions and heights of top-level editor blocks in the DOM. When content crosses a page boundary, a visual page-break decoration is inserted before the block that starts on the next page. Pagination updates are scheduled after layout changes to ensure measurements reflect the final rendered state.

### Trade-offs & Limitations

This approach relies on DOM measurements, which can vary with fonts, zoom levels, and asynchronously loaded content. Pagination operates at the block level, so large blocks are not split across pages. Page breaks are implemented as visual decorations rather than true page containers, which limits support for per-page headers, footers, or layout differences.

### Future Improvements

With more time, pagination could be made more precise by accounting for block heights and bottom positions, improving performance through debounced measurements and observers, and moving toward true page containers for better print parity and per-page layout control.