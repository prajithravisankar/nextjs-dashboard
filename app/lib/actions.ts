'use server';
// by marking this file as a server module, we ensure that all code inside
// this file is never sent to the client, and all exported functions are server actions
import { z } from 'zod';
import { revalidatePath } from "next/cache";
import postgres from "postgres";
import {redirect} from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});


const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // what is revalidate path?
    // It is a Next.js function that allows you to programmatically revalidate a specific path in your application.
    // This is particularly useful in scenarios where you have server-side rendered (SSR) or statically generated pages
    // that need to be updated when data changes, without waiting for the next automatic revalidation cycle.
    // for example: after creating a new invoice, we want to revalidate the invoices dashboard to reflect the new data
    // revalidatePath tells The cached HTML/data for this page is now stale. Please regenerate it next time someone visits
    revalidatePath('/dashboard/invoices');

    // what is redirect?
    // It is a function provided by Next.js that allows you to programmatically redirect users to a different route within your application.
    // This is particularly useful in server-side actions or API routes where you want to navigate the user to another page after performing certain operations,
    // such as form submissions or data processing.
    // for example: after creating an invoice, we want to redirect the user to the invoices dashboard
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Error failed to delete invoice'); // should be deleted after testing error handling in UI

    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}