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
    });

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance not found' }, { status: 404 });
    }

    return NextResponse.json(attendance);
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
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
} 