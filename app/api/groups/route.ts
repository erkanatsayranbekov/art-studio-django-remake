import { NextResponse } from 'next/server';
import { validateWeekdays, validateTimeRange } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate weekdays
    const weekdaysError = validateWeekdays(body.weekdays);
    console.log(weekdaysError);
    if (weekdaysError) {
      return NextResponse.json({ error: weekdaysError }, { status: 400 });
    }

    // Validate time range
    const timeError = validateTimeRange(new Date(body.startTime), new Date(body.endTime));
    if (timeError) {
      return NextResponse.json({ error: timeError }, { status: 400 });
    }

    const group = await prisma.group.create({
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
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        customers: true,
      },
    });
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
} 