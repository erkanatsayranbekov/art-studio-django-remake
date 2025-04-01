import { NextResponse } from 'next/server';
import { validateWeekdays, validateTimeRange } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(params.groupId) },
      include: {
        customers: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Get attendance counts for all customers in the group
    const attendanceCounts = await Promise.all(
      group.customers.map(async (customer) => {
        const count = await prisma.attendance.count({
          where: {
            customerId: customer.id,
            date: {
              lte: new Date(),
            },
            isPresent: true,
          },
        });
        return { customerId: customer.id, count };
      })
    );

    // Combine group data with attendance counts
    const groupWithAttendanceCount = {
      ...group,
      customers: group.customers.map(customer => ({
        ...customer,
        attendanceCount: attendanceCounts.find(ac => ac.customerId === customer.id)?.count || 0,
      })),
    };

    return NextResponse.json(groupWithAttendanceCount);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const body = await request.json();
    
    // Validate weekdays
    const weekdaysError = validateWeekdays(body.weekdays);
    if (weekdaysError) {
      return NextResponse.json({ error: weekdaysError }, { status: 400 });
    }

    // Validate time range
    const timeError = validateTimeRange(new Date(body.startTime), new Date(body.endTime));
    if (timeError) {
      return NextResponse.json({ error: timeError }, { status: 400 });
    }

    const group = await prisma.group.update({
      where: {
        id: Number(params.groupId),
      },
      data: {
        name: body.name,
        description: body.description,
        weekdays: body.weekdays,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        price: body.price,
        isPermanent: body.isPermanent,
      },
    });

    return NextResponse.json(group);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const group = await prisma.group.delete({
      where: {
        id: Number(params.groupId),
      },
    });

    return NextResponse.json(group);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
} 