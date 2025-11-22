# NEXT JS NOTES

## chapter 1: Getting started

- `npx create-next-app@latest [project-name] [options]` this is how we set up a new Next.js project
- Placeholder data: [placeholder-data.ts](./app/lib/placeholder-data.ts) will be used to simulate data fetching from an API or database
- [definitions.ts](./app/lib/definitions.ts) : this file contains type definitions for your data
- instead of writing `customers: { id: string; name: string; ... }[]` this everytime, with definitions.ts, we can just write `customers: User[]`
```typescript
// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};
```

## chapter 2: CSS styling

- [global.css](./app/styles/global.css) : this file contains global styles that apply to the entire application
- use this file to add CSS rules to all the routes in your application - such as CSS reset rules, site-wide styles for HTML elements like links, and more
- You can import global.css in any component in your application, but it's usually good practice to add it to your top-level component. In Next.js, this is the root layout [layout.tsx](./app/layout.tsx).
```typescript
// This is the root layout component for the Next.js application.
// It wraps all the pages and components in the application.
// Here, we import global CSS styles to apply them across the entire app.
import '@/app/styles/global.css';

export default function RootLayout({
   children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
```
before importing global css: ![img.png](img.png)
after importing global css: ![img_1.png](img_1.png)
- notice the tailwind directives inside global.css, which import Tailwind's base styles, components, and utilities. 
- Tailwind is a CSS framework that speeds up the development process by allowing you to quickly write utility classes directly in your React code.
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- example usage of tailwind classes in [page.tsx](./app/page.tsx)
- we don't have to use tailwind css we can use css modules
```css
/*
example of using css module instead of tailwindcss (an alternative)
*/
.shape {
    height: 0;
    width: 0;
    border-bottom: 30px solid black;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
}
```
- use clsx library to conditionally apply multiple classes to an element refer [status.tsx](app/ui/invoices/status.tsx)
```typescript
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

## chapter 3: Optimizing fonts and images

- why we need to optimze fonts and images?
  - performance: optimized fonts and images load faster, improving page load times and overall user experience.
  - SEO: search engines favor websites that load quickly, which can positively impact search rankings.
  - user experience: optimized assets lead to a smoother and more enjoyable browsing experience for users.
  - Cumulative Layout Shift is a metric used by Google to evaluate the performance and user experience of a website. With fonts, layout shift happens when the browser initially renders text in a fallback or system font and then swaps it out for a custom font once it has loaded. This swap can cause the text size, spacing, or layout to change, shifting elements around it.
  - when a user visits your application, there are no additional network requests for fonts which would impact performance.
  - Next.js downloads font files at build time and hosts them with your other static assets. This means when a user visits your application, there are no additional network requests for fonts which would impact performance.
  - Next.js can serve static assets, like images, under the top-level /public folder. Files inside /public can be referenced in your application.
  - you can use the next/image component to automatically optimize your images.
