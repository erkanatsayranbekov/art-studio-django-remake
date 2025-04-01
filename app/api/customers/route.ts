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
      },
    });

    // Get attendance counts for all customers
    const attendanceCounts = await Promise.all(
      customers.map(async (customer) => {
        const typedCustomer = customer as any;
        const count =  await prisma.attendance.count({
          where: {
            customerId: customer.id,
            date: {
              gte: typedCustomer.lastPaymentDate,
              lte: new Date(),
            },
            isPresent: true,
          },
        });
        return { customerId: customer.id, count };
      })
    );

    // Combine customers data with attendance counts
    const customersWithAttendanceCount = customers.map(customer => ({
      ...customer,
      attendanceCount: attendanceCounts.find(ac => ac.customerId === customer.id)?.count || 0,
    }));

    return NextResponse.json(customersWithAttendanceCount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
} 