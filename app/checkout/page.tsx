'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface CheckoutFormData {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice } = useCurrencyContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  
  const productSlug = searchParams.get('product');
  const size = searchParams.get('size') || 'M';
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [product, setProduct] = useState<any>(null);
  // Default payment methods for testing
  const defaultPaymentMethods = [
    {
      id: 'bacs',
      title: 'Direct Bank Transfer',
      description: 'Make your payment directly into our bank account.',
      method_title: 'Direct Bank Transfer',
      method_description: 'Make your payment directly into our bank account.',
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay with cash upon delivery.',
      method_title: 'Cash on Delivery',
      method_description: 'Pay with cash upon delivery.',
    },
    {
      id: 'stripe',
      title: 'Credit Card (Stripe)',
      description: 'Pay securely with your credit or debit card.',
      method_title: 'Credit Card',
      method_description: 'Pay securely with your credit or debit card.',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Pay via PayPal - you can pay with your credit card if you don\'t have a PayPal account.',
      method_title: 'PayPal',
      method_description: 'Pay via PayPal.',
    },
  ];
  const [paymentMethods, setPaymentMethods] = useState<any[]>(defaultPaymentMethods);
  const [formData, setFormData] = useState<CheckoutFormData>({
    billing: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US',
    },
    shipping: {
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US',
    },
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (productSlug) {
        try {
          const response = await fetch(`/api/products/${productSlug}`);
          if (response.ok) {
            const p = await response.json();
            setProduct(p);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    fetchProduct();
  }, [productSlug]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/payment-methods');
        if (response.ok) {
          const methods = await response.json();
          // If WooCommerce returns methods, use them, otherwise keep defaults
          if (methods && methods.length > 0) {
            setPaymentMethods(methods);
            // Set first payment method as default if not already set
            if (!paymentMethod) {
              setPaymentMethod(methods[0].id);
            }
          } else {
            // Keep default methods if WooCommerce returns empty
            if (!paymentMethod) {
              setPaymentMethod(defaultPaymentMethods[0].id);
            }
          }
        } else {
          // On error, keep default methods
          if (!paymentMethod) {
            setPaymentMethod(defaultPaymentMethods[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        // On error, keep default methods
        if (!paymentMethod) {
          setPaymentMethod(defaultPaymentMethods[0].id);
        }
      }
    };
    fetchPaymentMethods();
    // Set default payment method on initial load
    if (!paymentMethod) {
      setPaymentMethod(defaultPaymentMethods[0].id);
    }
  }, []);

  useEffect(() => {
    if (sameAsBilling) {
      setFormData((prev) => ({
        ...prev,
        shipping: {
          ...prev.billing,
        },
      }));
    }
  }, [sameAsBilling, formData.billing]);

  const handleInputChange = (
    section: 'billing' | 'shipping',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const price = product.discountPrice || product.price || 0;
    const shipping = 10.00;
    return (price * quantity) + shipping;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!product || !product.woocommerceId) {
      setError('Product not found');
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      setLoading(false);
      return;
    }

    const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);
    if (!selectedPaymentMethod) {
      setError('Invalid payment method selected');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billing: formData.billing,
          shipping: formData.shipping,
          lineItems: [
            {
              product_id: product.woocommerceId,
              quantity: quantity,
              price: (product.discountPrice || product.price || 0).toString(),
            },
          ],
          paymentMethod: paymentMethod,
          paymentMethodTitle: selectedPaymentMethod.title || selectedPaymentMethod.method_title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Store order data and show success screen
      setOrderData({
        orderId: data.order.id,
        orderKey: data.order.order_key,
        status: data.order.status,
        total: data.order.total,
        product: product,
        size: size,
        quantity: quantity,
        billing: formData.billing,
        shipping: formData.shipping,
        paymentMethod: selectedPaymentMethod.title || selectedPaymentMethod.method_title,
      });
      setSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Loading product...</p>
          <Link href="/" className="text-white underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const productPrice = product.discountPrice || product.price || 0;
  const subtotal = productPrice * quantity;
  const shipping = 10.00;
  const total = subtotal + shipping;

  // Show success screen if order is placed
  if (success && orderData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-600 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Order Placed Successfully!</h2>
              <p className="text-green-300 text-lg">Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Order Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Order ID:</span>
                      <span className="text-white font-medium">#{orderData.orderId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-medium capitalize">{orderData.status}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white">{orderData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-white font-bold text-lg">{formatPrice(parseFloat(orderData.total))}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Product Details
                  </h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={orderData.product.image || ''}
                      alt={orderData.product.title}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{orderData.product.title}</p>
                      <p className="text-gray-400 text-sm mt-1">Size: <span className="text-white">{orderData.size}</span></p>
                      <p className="text-gray-400 text-sm">Quantity: <span className="text-white">{orderData.quantity}</span></p>
                      <p className="text-white font-semibold mt-2">
                        {formatPrice((orderData.product.discountPrice || orderData.product.price || 0) * orderData.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {orderData.shipping.first_name} {orderData.shipping.last_name}<br />
                  {orderData.shipping.address_1}<br />
                  {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.postcode}<br />
                  {orderData.shipping.country}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href="/"
                className="bg-white text-black px-8 py-3 font-semibold hover:bg-gray-200 transition-colors duration-200 rounded-md"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setOrderData(null);
                  // Reset form
                  setFormData({
                    billing: {
                      first_name: '',
                      last_name: '',
                      email: '',
                      phone: '',
                      address_1: '',
                      address_2: '',
                      city: '',
                      state: '',
                      postcode: '',
                      country: 'US',
                    },
                    shipping: {
                      first_name: '',
                      last_name: '',
                      address_1: '',
                      address_2: '',
                      city: '',
                      state: '',
                      postcode: '',
                      country: 'US',
                    },
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gray-800 text-white px-8 py-3 font-semibold hover:bg-gray-700 transition-colors duration-200 rounded-md border border-gray-700"
              >
                Place Another Order
              </button>
            </div>

            <div className="text-sm text-gray-400">
              <p>You will receive an order confirmation email at <span className="text-white font-medium">{orderData.billing.email}</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && orderData && (
          <div className="mb-8 bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-600 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h2>
              <p className="text-green-300">Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order ID:</span>
                      <span className="text-white font-medium">#{orderData.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-medium capitalize">{orderData.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white">{orderData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-white font-bold text-lg">{formatPrice(parseFloat(orderData.total))}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Product Details</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={orderData.product.image || ''}
                      alt={orderData.product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{orderData.product.title}</p>
                      <p className="text-gray-400 text-sm">Size: {orderData.size}</p>
                      <p className="text-gray-400 text-sm">Quantity: {orderData.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                <p className="text-gray-300 text-sm">
                  {orderData.shipping.first_name} {orderData.shipping.last_name}<br />
                  {orderData.shipping.address_1}<br />
                  {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.postcode}<br />
                  {orderData.shipping.country}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-white text-black px-8 py-3 font-semibold hover:bg-gray-200 transition-colors duration-200 rounded-md"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setOrderData(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gray-800 text-white px-8 py-3 font-semibold hover:bg-gray-700 transition-colors duration-200 rounded-md border border-gray-700"
              >
                Place Another Order
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p>You will receive an order confirmation email at <span className="text-white">{orderData.billing.email}</span></p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Billing Details */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Billing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billing.first_name}
                      onChange={(e) => handleInputChange('billing', 'first_name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billing.last_name}
                      onChange={(e) => handleInputChange('billing', 'last_name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.billing.email}
                      onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.billing.phone}
                      onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billing.address_1}
                      onChange={(e) => handleInputChange('billing', 'address_1', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.billing.address_2}
                      onChange={(e) => handleInputChange('billing', 'address_2', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billing.city}
                      onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billing.state}
                      onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billing.postcode}
                      onChange={(e) => handleInputChange('billing', 'postcode', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.billing.country}
                      onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Shipping Details</h2>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-sm">Same as billing</span>
                  </label>
                </div>
                {!sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsBilling}
                        value={formData.shipping.first_name}
                        onChange={(e) => handleInputChange('shipping', 'first_name', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsBilling}
                        value={formData.shipping.last_name}
                        onChange={(e) => handleInputChange('shipping', 'last_name', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsBilling}
                        value={formData.shipping.address_1}
                        onChange={(e) => handleInputChange('shipping', 'address_1', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsBilling}
                        value={formData.shipping.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsBilling}
                        value={formData.shipping.state}
                        onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsBilling}
                        value={formData.shipping.postcode}
                        onChange={(e) => handleInputChange('shipping', 'postcode', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        required={!sameAsBilling}
                        value={formData.shipping.country}
                        onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                {paymentMethods.length === 0 ? (
                  <div className="text-gray-400">Loading payment methods...</div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center p-4 border border-gray-700 rounded-md cursor-pointer hover:border-white transition-colors"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3 w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{method.title || method.method_title}</div>
                          <div className="text-sm text-gray-400">
                            {method.description || method.method_description || 'Secure payment method'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-700">
                <img
                  src={product.image || ''}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-gray-400">Size: {size}</p>
                  <p className="text-sm text-gray-400">Quantity: {quantity}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-700">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
              </div>

              <div className="text-sm text-gray-400 space-y-2">
                <p>✓ Secure checkout</p>
                <p>✓ Free returns</p>
                <p>✓ Fast shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

