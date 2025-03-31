import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateAge } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const customer = await prisma.customer.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
        phoneNumber: body.phoneNumber,
        groupId: body.groupId,
      },
      include: {
        group: true,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        group: true,
        attendances: true,
      },
    });

    // Add age calculation to each customer
    const customersWithAge = customers.map((customer: { dateOfBirth: Date; }) => ({
      ...customer,
      age: calculateAge(customer.dateOfBirth),
    }));

    return NextResponse.json(customersWithAge);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
} 