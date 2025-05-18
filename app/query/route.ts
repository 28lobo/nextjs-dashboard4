import postgres from 'postgres';
import { NextResponse } from 'next/server';

// ensure we run in a Node.js runtime so the postgres client works
export const runtime = 'nodejs';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { require: true, rejectUnauthorized: false },
  // debug: true, // uncomment to see every query in your server logs
});

async function listInvoices() {
  try {
    return await sql`
      SELECT i.amount, c.name
      FROM invoices AS i
      JOIN customers AS c ON i.customer_id = c.id
      WHERE i.amount = ${666}
    `;
  } catch (err) {
    console.error('[listInvoices] SQL error:', (err as any).name, (err as any).code, (err as any).message);
    throw err;
  }
}

export async function GET() {
  try {
    const data = await listInvoices();
    return NextResponse.json(data);
  } catch (err: any) {
    // now we include the message for better diagnostics
    return NextResponse.json(
      { error: { name: err.name, code: err.code, message: err.message } },
      { status: 500 }
    );
  }
}
