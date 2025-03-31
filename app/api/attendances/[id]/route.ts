import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        customer: true,
        group: true,
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    // Transform the data to include customer and group names
    const transformedAttendance = {
      id: attendance.id.toString(),
      customerId: attendance.customerId.toString(),
      customerName: `${attendance.customer.firstName} ${attendance.customer.lastName}`,
      groupId: attendance.groupId.toString(),
      groupName: attendance.group.name,
      date: attendance.date.toISOString(),
      isPresent: attendance.isPresent,
    };

    return NextResponse.json(transformedAttendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isPresent } = body;

    const attendance = await prisma.attendance.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        isPresent,
      },
      include: {
        customer: true,
        group: true,
      },
    });

    // Transform the data to include customer and group names
    const transformedAttendance = {
      id: attendance.id.toString(),
      customerId: attendance.customerId.toString(),
      customerName: `${attendance.customer.firstName} ${attendance.customer.lastName}`,
      groupId: attendance.groupId.toString(),
      groupName: attendance.group.name,
      date: attendance.date.toISOString(),
      isPresent: attendance.isPresent,
    };

    return NextResponse.json(transformedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
} 