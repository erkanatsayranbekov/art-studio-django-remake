import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const customerId = searchParams.get('customerId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const where: any = {};
    if (groupId) where.groupId = parseInt(groupId);
    if (customerId) where.customerId = parseInt(customerId);
    if (month && year) {
      where.date = {
        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        lt: new Date(parseInt(year), parseInt(month), 1),
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Transform the data to include customer and group names
    const transformedAttendances = attendances.map((attendance: any) => ({
      ...attendance,
      customerName: `${attendance.customer.firstName} ${attendance.customer.lastName}`,
      groupName: attendance.group.name,
    }));

    return NextResponse.json(transformedAttendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle array of attendance records
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected an array of attendance records' },
        { status: 400 }
      );
    }

    // Create all attendance records
    const createdAttendances = await Promise.all(
      body.map(async (record) => {
        // Convert IDs to integers
        const customerId = parseInt(record.customerId);
        const groupId = parseInt(record.groupId);

        // Check if attendance already exists
        const existingAttendance = await prisma.attendance.findFirst({
          where: {
            customerId,
            groupId,
            date: new Date(record.date),
          },
        });

        if (existingAttendance) {
          // Update existing attendance
          return prisma.attendance.update({
            where: { id: existingAttendance.id },
            data: {
              isPresent: record.status === 'PRESENT',
            },
          });
        }

        // Create new attendance
        return prisma.attendance.create({
          data: {
            customerId,
            groupId,
            date: new Date(record.date),
            isPresent: record.status === 'PRESENT',
          },
        });
      })
    );

    return NextResponse.json(createdAttendances);
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    );
  }
} 