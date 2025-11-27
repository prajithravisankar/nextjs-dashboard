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
  - mobile version: ![img_2.png](img_2.png)
  - desktop version: ![img_3.png](img_3.png)
  - also the width and height attributes help prevent Cumulative Layout Shift by reserving the appropriate amount of space for the image before it loads.
  - these width and height are not exact display sizes but rather the intrinsic dimensions of the image. The actual display size can be controlled using CSS or other layout techniques.
```typescript jsx
<div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
    {/* Add Hero Images Here */}
    <Image
        src={"/hero-desktop.png"}
        alt={"Screenshots of the dashboard project showing desktop version"}
        width={1000}
        height={760}
        className={"hidden md:block"}
    />
    <Image
        src={'/hero-mobile.png'}
        alt={"Screenshots of the dashboard project showing mobile version"}
        width={500}
        height={620}
        className={"block md:hidden"}
    />
</div>
```

## Chapter 4: Creating layouts and Pages. 
- In Next.js, layouts are special components that define the structure and appearance of your pages. They allow you to create a consistent look and feel across multiple pages in your application.
- Layouts are typically used to wrap around your page components, providing common elements like headers, footers, navigation menus, and sidebars.
- In Next.js, you can create a layout by creating a file named layout.tsx in the directory where you want to apply the layout.
- For example, if you want to create a layout for all pages under the /dashboard directory, you would create a file at /dashboard/layout.tsx.
- Here's an example of a simple layout component: ![img_6.png](img_6.png)
```typescript jsx
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```
- In this example, the Layout component includes a SideNav component and a main content area where the children prop is rendered. The children prop represents the content of the specific page that uses this layout.
- To use this layout for a specific page, you would create a page component in the same directory, for example, /dashboard/page.tsx:
- A root layout is a special type of layout that applies to the entire application. In Next.js, you can create a root layout by creating a file named layout.tsx in the root of the /app directory. It is required in every Next.js application using the App Router.
  - ours is located at [layout.tsx](./app/layout.tsx)
- example of different pages inside app/dashboard: ![img_7.png](img_7.png)
  - now we have access to these links: http://localhost:3000/dashboard, http://localhost:3000/dashboard/invoices, http://localhost:3000/dashboard/customers

## Chapter 5: Navigation and linking between pages
- In Next.js, you can use the <Link /> Component to link between pages in your application. <Link> allows you to do client-side navigation with JavaScript.
- before this we are using <a> tag for navigation which causes a full page reload. With <Link>, Next.js intercepts the click event and performs a client-side navigation, which is faster and smoother.
```typescript jsx
<Link
    key={link.name}
    href={link.href}
    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
>
    <LinkIcon className="w-6" />
    <p className="hidden md:block">{link.name}</p>
</Link>
```
- Next.js automatically prefetches the code for the linked route in the background. By the time the user clicks the link, the code for the destination page will already be loaded in the background, and this is what makes the page transition near-instant!

## Chapter 6: Database setup
- setup database

## chapter 7: Fetching data
- In which of these scenarios should you not query your database directly?
  - When you're fetching data on the client: you should not query your database directly when fetching data on the client as this would expose your database secrets.
- What's one advantage of using React Server Components to fetch data?
  - They allow you to fetch data directly from your database without exposing your database secrets to the client.
- In Next.js everything is server-side by default unless you explicitly mark the file with: "use client";
  - By default → code runs on the server 
  - If you write "use client" → code runs in the browser
  - your database credentials stay hidden
  - your logic stays private, users cannot inspect it, and you avoid shipping unnecessary JS to the browser
  - You don’t need API routes for simple data fetching
    - Old way (React): client → /api/route → database
    - New way (Next.js): server component → database
- **The browser does NOT run the code.**, The server runs the code, and sends the result to the browser.
- Example workflow -> our code below runs on the server:
```typescript jsx
export default async function Dashboard() {
  const invoices = await sql`SELECT * FROM invoices`;
  return (
    <div>
      <h1>Invoices</h1>
      {invoices.map(i => <p key={i.id}>{i.amount}</p>)}
    </div>
  );
}
```
- browser receives this
```html
<div>
  <h1>Invoices</h1>
  <p>100</p>
  <p>200</p>
  <p>300</p>
</div>

```
- __But what if I have interactivity (button clicks, etc.)?__
  - In that case, you can use Client Components for the interactive parts of your application. Client Components run in the browser and can handle user interactions.
  - You can combine Server Components and Client Components in your application. For example, you can fetch data in a Server Component and then pass that data to a Client Component for rendering and interactivity.
  - check these three files to understand what is going on in this order: 
    - in [page.tsx](app/dashboard/page.tsx) we are fetching data from database: `const revenue = await fetchRevenue();`. 
    - next we go to [data.ts](app/lib/data.ts) where the fetchRevenue function is defined, this returns our data which we store above in the revenue variable.
    - next we go to [revenue-chart.tsx](app/ui/dashboard/revenue-chart.tsx) because in [page.tsx](app/dashboard/page.tsx) we are calling the component `<RevenueSummary revenue={revenue} />` and passing the fetched data as a prop.
- what is request waterfall? 
  - A "waterfall" refers to a sequence of network requests that depend on the completion of previous requests. In the case of data fetching, each request can only begin once the previous request has returned data.
  - This can lead to longer load times, as each request adds additional latency.![img_8.png](img_8.png)
  - For example, we need to wait for fetchRevenue() to execute before fetchLatestInvoices() can start running, and so on.
  - 
```typescript jsx
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
const {
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices,
} = await fetchCardData(); // wait for fetchLatestInvoices() to finish
``` 
  - A common way to avoid waterfalls is to initiate all data requests at the same time - in parallel.
  - Instead of waiting for each request to finish before starting the next one, you can start all requests simultaneously and then wait for all of them to complete.
    - ```typescript jsx
      const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
      ]);```
    - but there is one issue which is discussed in the next chapter. 

