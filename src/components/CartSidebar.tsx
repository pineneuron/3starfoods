'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

interface CartSidebarProps {
  initialOpen?: boolean;
}

// Configurable order rules
const MIN_ORDER_AMOUNT = 1000; // Rs.
const DELIVERY_FEE = 150;      // Rs. applied when subtotal < MIN_ORDER_AMOUNT

export default function CartSidebar({ initialOpen = false }: CartSidebarProps) {
  const [open, setOpen] = useState<boolean>(initialOpen);
  const [mode, setMode] = useState<'cart' | 'checkout'>('cart');
  const { 
    items, 
    increment, 
    decrement, 
    removeItem, 
    subtotal, 
    total, 
    discountAmount, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    clear 
  } = useCart();

  // checkout form state (UI only for now)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState<string | null>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    function toggle(e: Event) {
      const ev = e as CustomEvent<boolean | undefined>;
      if (typeof ev.detail === 'boolean') setOpen(ev.detail);
      else setOpen(prev => !prev);
    }
    function openEv() { setOpen(true); }
    function closeEv() { setOpen(false); }
    window.addEventListener('tsf:cart-toggle', toggle as EventListener);
    window.addEventListener('tsf:cart-open', openEv as EventListener);
    window.addEventListener('tsf:cart-close', closeEv as EventListener);
    return () => {
      window.removeEventListener('tsf:cart-toggle', toggle as EventListener);
      window.removeEventListener('tsf:cart-open', openEv as EventListener);
      window.removeEventListener('tsf:cart-close', closeEv as EventListener);
    };
  }, []);

  const hasItems = items.length > 0;
  const belowMinimum = total < MIN_ORDER_AMOUNT;
  const deliveryFeeApplied = hasItems && belowMinimum ? DELIVERY_FEE : 0;
  const grandTotal = total + deliveryFeeApplied;
  const amountToReachMinimum = Math.max(0, MIN_ORDER_AMOUNT - total);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const result = await applyCoupon(couponCode.trim());
      setCouponMessage({ 
        type: result.success ? 'success' : 'error', 
        text: result.message 
      });
      
      if (result.success) {
        setCouponCode('');
      }
    } catch {
      setCouponMessage({ type: 'error', text: 'Error applying coupon. Please try again.' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage(null);
  };

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
      },
      (err) => {
        setLocError(err.message || 'Unable to get your location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function onPaymentFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPaymentPreviewUrl(url);
    } else {
      if (paymentPreviewUrl) URL.revokeObjectURL(paymentPreviewUrl);
      setPaymentPreviewUrl(null);
    }
  }

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.';
    if (!email.trim()) return 'Email is required.';
    if (!phone.trim()) return 'Phone is required.';
    if (!city.trim()) return 'City is required.';
    if (!address.trim()) return 'Address is required.';
    return null;
  }

  async function placeOrder() {
    setSubmitError(null);
    const err = validate();
    if (err) {
      setSubmitError(err);
      return;
    }
    try {
      setSubmitLoading(true);
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone, city, address, landmark, notes, coords },
          items: items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, image: i.image })),
          summary: { subtotal, deliveryFee: deliveryFeeApplied, total: grandTotal, belowMinimum }
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || 'Failed to send order');
      setSubmitSuccess(true);
      clear();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Something went wrong';
      setSubmitError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[92vw] sm:w-[70vw] lg:w-[30vw] pb-10 flex flex-col justify-between bg-white tsf-box-shodow transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-bold tsf-font-sora uppercase">{mode === 'cart' ? 'Your Cart' : 'Checkout'}</h3>
          <button aria-label="Close" className="w-10 h-10 rounded-full tsf-bg-red text-white flex items-center justify-center" onClick={() => setOpen(false)}>×</button>
        </div>

        {mode === 'cart' ? (
          submitSuccess ? (
            <div className="h-[calc(100%-460px)] overflow-y-auto p-6 flex items-center justify-center text-center">
              <div>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
                <h4 className="text-md font-semibold tsf-font-sora">Order placed successfully</h4>
                <p className="text-sm text-gray-500 mt-1">We have sent a confirmation email.</p>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100%-460px)] overflow-y-auto">
              {hasItems ? (
                items.map((it, idx) => (
                  <div key={`${it.id}-${it.variation || 'default'}`} className={`flex items-start gap-4 p-6 ${idx !== 0 ? 'border-t' : ''}`}>
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={it.image} alt={it.name} width={96} height={96} className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold tsf-font-sora uppercase">{it.name}</h4>
                          {it.variation && (
                            <p className="text-xs text-blue-600 font-medium mt-1">Variation: {it.variation}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">RS {it.price.toFixed(2)}</p>
                        </div>
                        <button aria-label="Remove" className="text-gray-400 hover:text-black" onClick={() => removeItem(it.id, it.variation)}>×</button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="w-8 h-8 rounded-full border" onClick={() => decrement(it.id, it.variation)}>-</button>
                        <span className="w-8 text-center">{it.qty}</span>
                        <button className="w-8 h-8 rounded-full border" onClick={() => increment(it.id, it.variation)}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center p-8 text-center">
                  <div>
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">🛒</div>
                    <h4 className="text-md font-semibold tsf-font-sora">Your cart is empty</h4>
                    <p className="text-sm text-gray-500 mt-1">Add items to get started.</p>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="h-[calc(100%-260px)] overflow-y-auto p-6">
            {submitSuccess ? (
              <div className="flex items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
                  <h4 className="text-md font-semibold tsf-font-sora">Order placed successfully</h4>
                  <p className="text-sm text-gray-500 mt-1">We have sent a confirmation email.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm">Name <span className="text-red-600">*</span></label>
                <input type="text" className="w-full border rounded-md p-3" value={name} onChange={(e) => setName(e.target.value)} />

                <label className="block text-sm">Email <span className="text-red-600">*</span></label>
                <input type="email" className="w-full border rounded-md p-3" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="block text-sm">Phone <span className="text-red-600">*</span></label>
                <input type="tel" className="w-full border rounded-md p-3" value={phone} onChange={(e) => setPhone(e.target.value)} />

                <label className="block text-sm">City <span className="text-red-600">*</span></label>
                <select className="w-full border rounded-md p-3" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Lalitpur">Lalitpur</option>
                </select>

                <label className="block text-sm">Address <span className="text-red-600">*</span></label>
                <div className="relative">
                  <input type="text" className="w-full border rounded-md p-3 pr-12" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <button type="button" aria-label="Use my location" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md border flex items-center justify-center" onClick={useMyLocation}>
                    <span className="text-lg">📍</span>
                  </button>
                </div>
                {coords && (
                  <div className="text-xs text-gray-600">Location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}{' '}
                    <a className="underline" href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`} target="_blank" rel="noreferrer">View map</a>
                  </div>
                )}
                {locError && (
                  <div className="text-xs text-red-600">{locError}</div>
                )}

                <label className="block text-sm">Nearest Landmark</label>
                <input type="text" className="w-full border rounded-md p-3" value={landmark} onChange={(e) => setLandmark(e.target.value)} />

                <label className="block text-sm">Notes</label>
                <textarea className="w-full border rounded-md p-3" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>

                <div className="mt-2 border rounded-md p-4">
                  <h5 className="text-sm font-semibold tsf-font-sora mb-2">Pay to Bank (QR)</h5>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-28 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      <Image src="/images/payment-qr.png" alt="payment-qr" width={112} height={112} className="object-contain" />
                    </div>
                    <div className="text-sm">
                      <div><span className="font-semibold">Account Name:</span> 3 Star Foods Pvt. Ltd.</div>
                      <div><span className="font-semibold">Account No:</span> 12345678901234</div>
                      <div><span className="font-semibold">Bank:</span> XYZ Bank, Nepal</div>
                      <div className="text-xs text-gray-500 mt-1">After payment, optionally upload screenshot below.</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1">Upload payment screenshot</label>
                    <input type="file" accept="image/*" onChange={onPaymentFileChange} className="w-full text-sm" />
                    {paymentPreviewUrl && (
                      <div className="mt-2 w-28 h-28 rounded-md overflow-hidden bg-gray-50">
                        <Image src={paymentPreviewUrl} alt="payment-proof" width={112} height={112} className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="rounded-md bg-red-50 text-red-700 text-sm p-3">{submitError}</div>
                )}
              </div>
            )}
          </div>
        )}

        {hasItems && (
          <div className="border-t p-6 space-y-3">
            {belowMinimum && (
              <div className="rounded-md bg-yellow-50 text-yellow-800 text-sm p-3">
                Add <span className="font-semibold">Rs. {amountToReachMinimum.toFixed(2)}</span> more to reach the minimum order amount (Rs. {MIN_ORDER_AMOUNT}). You can still checkout now; a delivery fee applies.
              </div>
            )}
            
            {/* Coupon Section */}
            <div className="space-y-2">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {appliedCoupon.coupon.name} ({appliedCoupon.coupon.code})
                    </p>
                    <p className="text-xs text-green-600">
                      -Rs. {appliedCoupon.discountAmount.toFixed(2)} discount
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {couponMessage && (
                <div className={`text-sm p-2 rounded-md ${
                  couponMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {couponMessage.text}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Discount ({appliedCoupon?.coupon.code})</span>
                <span className="font-medium">-Rs. {discountAmount.toFixed(2)}</span>
              </div>
            )}
            {deliveryFeeApplied > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery fee</span>
                <span className="font-medium">Rs. {deliveryFeeApplied.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm border-t pt-3">
              <span className="text-gray-800 font-semibold">Total</span>
              <span className="font-bold">Rs. {grandTotal.toFixed(2)}</span>
            </div>
            {mode === 'cart' ? (
              <button className="w-full tsf-bg-blue text-white rounded-full py-4 text-lg font-semibold cursor-pointer" onClick={() => setMode('checkout')}>Checkout</button>
            ) : (
              <div className="flex gap-3">
                <button className="flex-1 border rounded-full py-4 text-lg" onClick={() => setMode('cart')}>Back</button>
                <button className="flex-1 tsf-bg-blue text-white rounded-full py-4 text-lg font-semibold" onClick={placeOrder} disabled={submitLoading}>{submitLoading ? 'Placing Order...' : 'Place Order'}</button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
