import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { navigate } from '@/lib/router';
import { whatsappCartOrder } from '@/lib/whatsapp';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="text-stone-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-stone-800 mb-3">Your Cart is Empty</h1>
        <p className="text-stone-500 mb-6">Browse our collection and add some products to your cart.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-stone-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-900 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const subtotal = totalPrice;
  const shipping = subtotal >= 25000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleWhatsAppOrder = () => {
    const cartItems = items.map(i => ({
      name: i.product.name,
      price: `Rs. ${i.product.price.toLocaleString('en-IN')}`,
      quantity: i.quantity,
    }));
    window.open(whatsappCartOrder(cartItems, `Rs. ${total.toLocaleString('en-IN')}`), '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Shopping Cart ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.product.slug}`)}>
                {item.product.image_url && (
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-stone-800 cursor-pointer hover:text-stone-900 line-clamp-1"
                  onClick={() => navigate(`/product/${item.product.slug}`)}
                >
                  {item.product.name}
                </h3>
                <p className="text-sm text-stone-500">{item.product.brand} &middot; {item.product.material}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-stone-900">Rs. {item.product.price.toLocaleString('en-IN')}</span>
                  {item.product.mrp > item.product.price && (
                    <span className="text-sm text-stone-400 line-through">Rs. {item.product.mrp.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-stone-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-900">
                      Rs. {(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-stone-500 hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-stone-200 rounded-xl p-5 sticky top-32">
            <h2 className="font-bold text-stone-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium text-stone-800">Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Delivery</span>
                <span className="font-medium text-stone-800">
                  {shipping === 0 ? <span className="text-green-600">FREE</span> : `Rs. ${shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  Free delivery on orders above Rs. 25,000
                </p>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="font-bold text-stone-800">Total</span>
                <span className="font-bold text-stone-900 text-lg">Rs. {total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-4 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Order on WhatsApp
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-sm text-stone-600 hover:text-stone-900 mt-3"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
