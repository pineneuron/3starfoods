import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[ORDERS CREATE API] POST request received at:', new Date().toISOString());
  try {
    const body = await request.json();
    console.log('[ORDERS CREATE API] Request body received');
    
    // Validate required fields
    if (!body.customer || !body.items || !body.summary) {
      return NextResponse.json({ ok: false, error: 'Missing required fields: customer, items, or summary' }, { status: 400 });
    }
    
    const {
      customer,
      items,
      summary,
      paymentScreenshot
    } = body as {
      customer: {
        name: string;
        email: string;
        phone: string;
        city: string;
        address: string;
        landmark?: string;
        notes?: string;
        coords?: { lat: number; lng: number } | null;
      };
      items: Array<{ id: string; name: string; qty: number; price: number; image?: string }>;
      summary: { subtotal: number; deliveryFee: number; total: number; belowMinimum: boolean };
      paymentScreenshot?: string;
    };

    console.log('[ORDERS CREATE API] Processing order for:', customer.email);

    const token = process.env.MAILTRAP_TOKEN;
    const fromEmail = process.env.MAIL_FROM_EMAIL || 'orders@example.com';
    const fromName = process.env.MAIL_FROM_NAME || '3 Star Foods';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    if (!token) {
      console.warn('[ORDERS CREATE API] Missing MAILTRAP_TOKEN');
      return NextResponse.json({ ok: false, error: 'Missing MAILTRAP_TOKEN' }, { status: 500 });
    }

    const to = [
      { email: adminEmail, name: 'Admin' },
      { email: customer.email, name: customer.name }
    ];

    const itemsHtml = items.map(i => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${i.qty}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">Rs. ${i.price.toFixed(2)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">Rs. ${(i.price * i.qty).toFixed(2)}</td>
      </tr>
    `).join('');

    const coordsText = customer.coords ? `${customer.coords.lat}, ${customer.coords.lng}` : 'N/A';

    const html = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
        <h2 style="margin:0 0 12px;">New Order</h2>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>City:</strong> ${customer.city}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
        <p><strong>Landmark:</strong> ${customer.landmark || ''}</p>
        <p><strong>Location (lat,lng):</strong> ${coordsText}</p>
        ${customer.notes ? `<p><strong>Notes:</strong> ${customer.notes}</p>` : ''}
        <h3 style="margin:16px 0 8px;">Items</h3>
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
          <thead>
            <tr>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc;">Item</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc;">Qty</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc;">Price</th>
              <th align="left" style="padding:6px 8px;border-bottom:1px solid #ccc;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p style="margin-top:12px;"><strong>Subtotal:</strong> Rs. ${summary.subtotal.toFixed(2)}</p>
        ${summary.deliveryFee > 0 ? `<p><strong>Delivery Fee:</strong> Rs. ${summary.deliveryFee.toFixed(2)}</p>` : ''}
        <p><strong>Order Total:</strong> Rs. ${summary.total.toFixed(2)}</p>
        ${paymentScreenshot ? `
          <h3 style="margin:16px 0 8px;">Payment Screenshot</h3>
          <p><a href="${paymentScreenshot}" target="_blank" style="color:#007bff;text-decoration:underline;">View payment screenshot</a></p>
          <img src="${paymentScreenshot}" alt="Payment screenshot" style="max-width:400px;margin-top:8px;border:1px solid #ddd;border-radius:4px;" />
        ` : ''}
      </div>
    `;

    const payload = {
      from: { email: fromEmail, name: fromName },
      to,
      subject: `New Order - ${customer.name}`,
      text: `New order from ${customer.name} for Rs ${summary.total.toFixed(2)}`,
      html
    };

    const res = await fetch('https://sandbox.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ ok: false, error: errText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error('[ORDERS CREATE API] Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}

