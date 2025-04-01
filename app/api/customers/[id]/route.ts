import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        group: true,
      },
    });
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get attendance count since last payment
    const attendanceCount = await prisma.attendance.count({
      where: {
        customerId: customer.id,
        date: {
          gte: customer.lastPaymentDate,
          lte: new Date(),
        },
        isPresent: true,
      },
    });

    // Combine customer data with attendance count
    const customerWithAttendanceCount = {
      ...customer,
      attendanceCount: attendanceCount || 0,
    };
    
    return NextResponse.json(customerWithAttendanceCount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const customer = await prisma.customer.update({
      where: { id: parseInt(params.id) },
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
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.update({
      where: { id: parseInt(params.id) },
      data: {
        lastPaymentDate: new Date(),
      },
      include: {
        group: true,
      },
    });

    // Get updated attendance count
    const attendanceCount = await prisma.attendance.count({
      where: {
        customerId: customer.id,
        date: {
          gte: customer.lastPaymentDate,
          lte: new Date(),
        },
        isPresent: true,
      },
    });

    return NextResponse.json({
      ...customer,
      attendanceCount: attendanceCount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment date' }, { status: 500 });
  }
} 