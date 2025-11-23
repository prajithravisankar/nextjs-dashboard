import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* ------------------  USERS  ------------------ */
async function seedUsers() {
    await sql`
        CREATE TABLE IF NOT EXISTS users (
                                             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            );
    `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return sql`
                INSERT INTO users (id, name, email, password)
                VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
                    ON CONFLICT (id) DO NOTHING;
            `;
        }),
    );

    return insertedUsers;
}

/* ------------------  CUSTOMERS  ------------------ */
async function seedCustomers() {
    await sql`
        CREATE TABLE IF NOT EXISTS customers (
                                                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            image_url VARCHAR(255) NOT NULL
            );
    `;

    const insertedCustomers = await Promise.all(
        customers.map((customer) => {
            return sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `;
        }),
    );

    return insertedCustomers;
}

/* ------------------  INVOICES  ------------------ */
async function seedInvoices() {
    await sql`
        CREATE TABLE IF NOT EXISTS invoices (
                                                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            customer_id UUID NOT NULL,
            amount INT NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL
            );
    `;

    const insertedInvoices = await Promise.all(
        invoices.map((invoice) => {
            return sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `;
        }),
    );

    return insertedInvoices;
}

/* ------------------  REVENUE  ------------------ */
async function seedRevenue() {
    await sql`
        CREATE TABLE IF NOT EXISTS revenue (
                                               month VARCHAR(4) NOT NULL UNIQUE,
            revenue INT NOT NULL
            );
    `;

    const insertedRevenue = await Promise.all(
        revenue.map((rev) => {
            return sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `;
        }),
    );

    return insertedRevenue;
}

/* ------------------  MAIN GET HANDLER  ------------------ */
export async function GET() {
    try {
        // ❗ Create the extension ONCE, and OUTSIDE any transaction
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // ❗ Wrap actual seeding inside a single transaction
        await sql.begin(async (sql) => {
            await seedUsers();
            await seedCustomers();
            await seedInvoices();
            await seedRevenue();
        });

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('SEED ERROR:', error);
        return Response.json({ error }, { status: 500 });
    }
}
