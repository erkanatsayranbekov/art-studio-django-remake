import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CustomerWithAttendances {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  groupId: number;
  lastPaymentDate: Date;
  group: {
    id: number;
    name: string;
    description: string;
    weekdays: string;
    startTime: Date;
    endTime: Date;
    price: number;
    isPermanent: boolean;
  };
  attendances: {
    id: number;
    customerId: number;
    groupId: number;
    date: Date;
    isPresent: boolean;
    status: string;
  }[];
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        group: true,
        attendances: {
          where: {
            date: {
              lte: new Date(),
            },
            isPresent: true,
          },
        },
      },
    });

    // Filter customers with 7 or more attendances since last payment
    const overdueCustomers = customers
      .map(customer => {
        const typedCustomer = customer as any;
        return {
          ...customer,
          attendanceCount: customer.attendances.filter(attendance => 
            new Date(attendance.date) >= new Date(typedCustomer.lastPaymentDate)
          ).length,
        };
      })
      .filter(customer => customer.attendanceCount >= 7);

    return NextResponse.json(overdueCustomers);
  } catch (error) {
    console.error('Error fetching overdue customers:', error);
    return NextResponse.json({ error: 'Failed to fetch overdue customers' }, { status: 500 });
  }
} 