import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceOrder } from '@/lib/woocommerce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { billing, shipping, lineItems, paymentMethod, paymentMethodTitle } = body;

    // Validate required fields
    if (!billing || !shipping || !lineItems || !lineItems.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in WooCommerce
    const order = await createWooCommerceOrder({
      billing,
      shipping,
      line_items: lineItems,
      payment_method: paymentMethod || 'bacs',
      payment_method_title: paymentMethodTitle || 'Direct Bank Transfer',
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        order_key: `order_${order.id}_${Date.now()}`,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

