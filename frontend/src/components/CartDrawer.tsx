import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { navigate } from '@/lib/router';
import { whatsappCartOrder } from '@/lib/whatsapp';

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-[#071522] text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[#14263a] rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag
                size={48}
                className="mx-auto text-stone-300 mb-4"
              />

              <p className="text-stone-600 font-medium">
                Your cart is empty
              </p>

              <p className="text-sm text-stone-500 mt-2">
                Start adding products to your cart
              </p>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/');
                }}
                className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff9d17] hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-800 text-sm line-clamp-2">
                    {item.product.name}
                  </h3>

                  <p className="text-lg font-bold text-stone-900 mt-1">
                    ₹{item.product.price}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      className="p-1 hover:bg-stone-200 rounded transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus
                        size={16}
                        className="text-stone-600"
                      />
                    </button>

                    <span className="w-8 text-center font-semibold text-stone-800">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      className="p-1 hover:bg-stone-200 rounded transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus
                        size={16}
                        className="text-stone-600"
                      />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    removeFromCart(item.product.id)
                  }
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors mt-auto"
                  aria-label="Remove from cart"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 p-6 space-y-4 bg-stone-50">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">
                  Subtotal:
                </span>

                <span className="font-semibold text-stone-800">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-stone-600">
                  Shipping:
                </span>

                <span className="font-semibold text-stone-800">
                  Quoted on order
                </span>
              </div>

              <div className="border-t border-stone-200 pt-2 flex justify-between">
                <span className="font-bold text-stone-800">
                  Total:
                </span>

                <span className="font-bold text-lg text-stone-900">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/cart');
              }}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-[#ff9d17] hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              Review Order <ArrowRight size={18} />
            </button>

            {/* WhatsApp Order */}
            <a
              href={whatsappCartOrder(
                items.map((item) => ({
                  name: item.product.name,
                  price: `₹${item.product.price}`,
                  quantity: item.quantity,
                })),
                `₹${totalPrice.toFixed(2)}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/');
              }}
              className="w-full border border-stone-300 text-stone-800 py-3 rounded-lg font-semibold hover:bg-stone-100 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
