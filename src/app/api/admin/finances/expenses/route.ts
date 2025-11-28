import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { eq, and, gte, lte, like, or, desc, asc } from 'drizzle-orm';

// GET - Fetch expenses with filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const taxDeductible = searchParams.get('taxDeductible');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query conditions
    const conditions = [];

    if (startDate && endDate) {
      conditions.push(gte(expenses.date, startDate));
      conditions.push(lte(expenses.date, endDate));
    }

    if (category && category !== 'all') {
      conditions.push(eq(expenses.category, category));
    }

    if (taxDeductible === 'true') {
      conditions.push(eq(expenses.taxDeductible, true));
    } else if (taxDeductible === 'false') {
      conditions.push(eq(expenses.taxDeductible, false));
    }

    if (search) {
      conditions.push(
        or(
          like(expenses.vendor, `%${search}%`),
          like(expenses.description, `%${search}%`),
          like(expenses.subcategory, `%${search}%`)
        )!
      );
    }

    // Build query
    let query = db.select().from(expenses);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const orderColumn = sortBy === 'amount' ? expenses.amount :
                       sortBy === 'category' ? expenses.category :
                       expenses.date;

    query = query.orderBy(
      sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn)
    ) as any;

    const results = await query;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST - Create new expense
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      date,
      category,
      subcategory,
      amount,
      vendor,
      description,
      receiptUrl,
      paymentMethod,
      taxDeductible,
      notes
    } = body;

    // Validation
    if (!date || !category || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: date, category, amount' },
        { status: 400 }
      );
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate ID
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert expense
    await db.insert(expenses).values({
      id,
      date,
      category,
      subcategory: subcategory || null,
      amount: amount.toString(),
      vendor: vendor || null,
      description: description || null,
      receiptUrl: receiptUrl || null,
      paymentMethod: paymentMethod || null,
      taxDeductible: taxDeductible !== false, // Default true
      notes: notes || null,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Fetch the created expense
    const [newExpense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id));

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
