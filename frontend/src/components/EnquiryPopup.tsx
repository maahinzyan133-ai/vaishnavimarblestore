import { useEffect, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '917003948297';

export function EnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    interestedIn: '',
    message: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.mobile.trim()) {
      return;
    }

    const message = `
Hello Vaishnavi Marble,

I would like to make an enquiry.

Name: ${form.name}
Mobile: ${form.mobile}
Email: ${form.email || 'Not provided'}
Interested In: ${form.interestedIn || 'Not specified'}
Message: ${form.message || 'No message'}

Thank you.
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    setSubmitted(true);

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);

      setForm({
        name: '',
        mobile: '',
        email: '',
        interestedIn: '',
        message: '',
      });
    }, 1500);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition hover:bg-gray-100 hover:text-black"
          aria-label="Close enquiry form"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-stone-900 px-6 py-6 pr-16 text-white">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500">
              <MessageCircle size={23} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Enquire Now
              </h2>

              <p className="text-sm text-stone-300">
                Get in touch with Vaishnavi Marble
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-stone-300">
            Fill in your details and send your enquiry directly on WhatsApp.
          </p>
        </div>

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="max-h-[75vh] overflow-y-auto px-6 py-6"
          >
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="enquiry-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>

              <input
                id="enquiry-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-stone-700 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label
                htmlFor="enquiry-mobile"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>

              <input
                id="enquiry-mobile"
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
                pattern="[0-9+\-\s]{10,15}"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-stone-700 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="enquiry-email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="enquiry-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-stone-700 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            {/* Interested In */}
            <div className="mb-4">
              <label
                htmlFor="enquiry-interest"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Interested In
              </label>

              <select
                id="enquiry-interest"
                name="interestedIn"
                value={form.interestedIn}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-700 focus:ring-2 focus:ring-stone-200"
              >
                <option value="">Select a product</option>
                <option value="Marble">Marble</option>
                <option value="Granite">Granite</option>
                <option value="Tiles">Tiles</option>
                <option value="Sanitaryware">Sanitaryware</option>
                <option value="Kitchen Sink">Kitchen Sink</option>
                <option value="Vanity">Vanity</option>
                <option value="Parking Tiles">Parking Tiles</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-5">
              <label
                htmlFor="enquiry-message"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Message
              </label>

              <textarea
                id="enquiry-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what you need..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-stone-700 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-[0.98]"
            >
              <MessageCircle size={20} />
              Submit Enquiry on WhatsApp
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Your enquiry will open in WhatsApp for you to send.
            </p>
          </form>
        ) : (
          /* Success */
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MessageCircle
                size={32}
                className="text-green-600"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              WhatsApp Opened
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Your enquiry message is ready in WhatsApp.
              Please press Send to submit it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

