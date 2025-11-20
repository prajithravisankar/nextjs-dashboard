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