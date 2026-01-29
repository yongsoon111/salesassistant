import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, createCustomer } from '@/lib/notion';

export async function GET() {
  try {
    const customers = await getCustomers();
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createCustomer({
      name: body.name,
      company: body.company || '',
      status: body.status || '리드',
      notes: body.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
    });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Failed to create customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
