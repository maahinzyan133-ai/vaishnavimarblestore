import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Clock,
  Calculator,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  UserCog,
  ExternalLink,
  Send,
  X,
} from 'lucide-react';

import { navigate } from '@/lib/router';
import { api } from '@/lib/api';
import type { Category } from '@/types';
import { whatsappEnquiry } from '@/lib/whatsapp';

const FOOTER_GROUPS = [
  {
    title: 'Tiles by Space',
    items: [
      'Floor Tiles',
      'Wall Tiles',
      'Bathroom Tiles',
      'Kitchen Tiles',
      'Living Room Tiles',
      'Outdoor Tiles',
      'Parking Tiles',
      'Bedroom Tiles',
      'Elevation Tiles',
      'Balcony Tiles',
      'Pooja Room Tiles',
      'Stair Tiles',
    ],
  },
  {
    title: 'Tiles by Finish',
    items: [
      'Anti Skid Tiles',
      'Glossy Tiles',
      'Polished Tiles',
      'Matt Tiles',
      'Carving Tiles',
      'Metallic Tiles',
      'Rustic Tiles',
      'Lappato Tiles',
      'Satin Tiles',
      'Hi-Gloss Tiles',
      'Wall Panels',
      'Fluted Panels',
    ],
  },
  {
    title: 'Tiles by Design',
    items: [
      '3D Tiles',
      'Wooden Tiles',
      'Marble Tiles',
      'Texture Tiles',
      'Mosaic Tiles',
      'Granite Tiles',
      'Stone Tiles',
      'Pattern Tiles',
      'Geometric Tiles',
      'Cement Tiles',
      'Travertine Tiles',
      'Terrazzo Tiles',
    ],
  },
  {
    title: 'Tiles by Type',
    items: [
      'Vitrified Tiles',
      'Ceramic Tiles',
      'Porcelain Tiles',
      'Designer Tiles',
      'Digital Tiles',
      'Glazed Tiles',
      'Cool Tiles',
      'Printed Tiles',
      'Nano Tiles',
      'Imported Tiles',
      'Italian Tiles',
      'Spanish Tiles',
    ],
  },
];

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactOpen, setContactOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    city: '',
    message: '',
  });

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(error => console.error('Footer categories loading error:', error));
  }, []);

  const handleSearchLink = (item: string) => {
    navigate(`/search/${encodeURIComponent(item)}`);
  };

  const handleCallback = (event: React.FormEvent) => {
    event.preventDefault();

    const message = `
Hello Vaishnavi Marble,

I would like to contact you.

Name: ${form.name}
Mobile: ${form.mobile}
City: ${form.city}

Message:
${form.message}
    `.trim();

    window.open(whatsappEnquiry(message), '_blank');

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: '',
        mobile: '',
        city: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <footer className="bg-[#071522] text-slate-300 mt-16 overflow-hidden">

      {/* =========================================================
          PART 1 — SHOWROOM / ADDRESS / MAP
      ========================================================== */}
      <section className="border-y border-slate-700 bg-[#102236]">
        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-8 items-stretch">

            {/* ADDRESS SECTION */}
            <div className="space-y-5">

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin
                    size={23}
                    className="text-[#ff9d17] shrink-0"
                  />

                  <h3 className="text-white text-lg font-bold">
                    Our Locations
                  </h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  Visit us or contact our team for tiles, marble,
                  granite, sanitaryware, kitchen sinks, vanities and
                  other premium surfaces.
                </p>
              </div>

              {/* ADDRESS 1 */}
              <div
                className="
                  rounded-xl
                  border border-slate-700
                  bg-[#071522]
                  p-5
                  transition-all duration-300
                  hover:border-[#ff9d17]
                  hover:-translate-y-1
                "
              >
                <div className="flex gap-3">
                  <MapPin
                    size={20}
                    className="text-[#ff9d17] mt-1 shrink-0"
                  />

                  <div>
                    <p className="text-white font-semibold text-sm mb-2">
                      Address
                    </p>

                    <p className="text-sm text-slate-400 leading-7">
                      Krishnapur Taruliya Main Road, near Chanchal
                      Kumari Girls High School, Sonartari Apartment,
                      P.S. New Town, Kolkata - 700102
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS 2 */}
              <div
                className="
                  rounded-xl
                  border border-slate-700
                  bg-[#071522]
                  p-5
                  transition-all duration-300
                  hover:border-[#ff9d17]
                  hover:-translate-y-1
                "
              >
                <div className="flex gap-3">
                  <MapPin
                    size={20}
                    className="text-[#ff9d17] mt-1 shrink-0"
                  />

                  <div>
                    <p className="text-white font-semibold text-sm mb-2">
                      Address
                    </p>

                    <p className="text-sm text-slate-400 leading-7">
                      Omathati, Kashinathpur, Bishnupur, on 211 road,
                      to, Patharghata, Newtown, kolkata, West Bengal
                      700135
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <a
                  href="tel:+919330300408"
                  className="
                    flex items-center gap-3
                    rounded-lg
                    bg-[#071522]
                    border border-slate-700
                    px-4 py-3
                    hover:border-[#ff9d17]
                    hover:text-[#ff9d17]
                    transition-all
                  "
                >
                  <Phone size={18} className="text-[#ff9d17]" />

                  <span className="text-sm">
                    +91 93303 00408
                  </span>
                </a>

                <a
                  href="tel:+919836344786"
                  className="
                    flex items-center gap-3
                    rounded-lg
                    bg-[#071522]
                    border border-slate-700
                    px-4 py-3
                    hover:border-[#ff9d17]
                    hover:text-[#ff9d17]
                    transition-all
                  "
                >
                  <Phone size={18} className="text-[#ff9d17]" />

                  <span className="text-sm">
                    +91 98363 44786
                  </span>
                </a>

                <a
                  href="mailto:marblevaishnavi@gmail.com"
                  className="
                    sm:col-span-2
                    flex items-center gap-3
                    rounded-lg
                    bg-[#071522]
                    border border-slate-700
                    px-4 py-3
                    hover:border-[#ff9d17]
                    hover:text-[#ff9d17]
                    transition-all
                  "
                >
                  <Mail size={18} className="text-[#ff9d17]" />

                  <span className="text-sm break-all">
                    marblevaishnavi@gmail.com
                  </span>
                </a>

              </div>
            </div>

            {/* MAP */}
            <div
              className="
                rounded-xl
                overflow-hidden
                border border-slate-700
                min-h-[380px]
                bg-[#071522]
                shadow-lg
              "
            >
              <iframe
                title="Vaishnavi Marble Showroom Location"
                src="https://www.google.com/maps?q=Krishnapur%20Taruliya%20Main%20Road%2C%20near%20Chanchal%20Kumari%20Girls%20High%20School%2C%20Kolkata%20700102&output=embed"
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
              />
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTACT + BRAND SECTION
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-3 mb-5">

              <img
                src="/logo.jpeg"
                alt="Vaishnavi Marble"
                className="
                  w-12 h-12
                  rounded-xl
                  object-cover
                  shadow-lg
                "
              />

              <div>
                
                <h2 className="text-[#ff9d17] font-bold text-xl tracking-wide">
                      VAISHNAVI MARBLE
                 </h2>

               <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white">
                    Tiles • Marble • Interiors
               </div>
              </div>

            </div>

            <p className="text-sm text-slate-400 leading-7 max-w-xl">
              The leading destination for exquisite marble,
              tiles, granite, sanitaryware, kitchen sinks,
              vanities, parking tiles, marble statues, mandirs
              and premium surfaces in Kolkata.
            </p>


            {/* SOCIAL / BUSINESS LINKS */}
            <div className="flex flex-wrap items-center gap-3 mt-6">

              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/vaishnavimarble/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vaishnavi Marble Instagram"
                className="
                  group
                  inline-flex items-center gap-2
                  px-3.5 py-2
                  rounded-lg
                  bg-[#14263a]
                  border border-slate-700
                  text-white
                  hover:border-[#ff9d17]
                  hover:text-[#ff9d17]
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <Instagram
                  size={19}
                  className="group-hover:scale-110 transition-transform"
                />

                <span className="text-sm font-medium">
                  Instagram
                </span>
              </a>


              {/* GOOGLE BUSINESS */}
              <a
                href="https://share.google/NwdYRdK6JAvO8rkJk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vaishnavi Marble Google Business"
                className="
                  group
                  inline-flex items-center gap-2
                  px-3.5 py-2
                  rounded-lg
                  bg-[#14263a]
                  border border-slate-700
                  text-white
                  hover:border-[#ff9d17]
                  hover:text-[#ff9d17]
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    w-5 h-5
                    rounded-full
                    bg-white
                    flex items-center justify-center
                    text-[13px]
                    font-black
                    text-blue-600
                    group-hover:scale-110
                    transition-transform
                  "
                >
                  G
                </span>

                <span className="text-sm font-medium">
                  Google Business
                </span>
              </a>


              {/* FACEBOOK */}
              <a
                href="https://facebook.com/vaishnavimarble"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vaishnavi Marble Facebook"
                className="
                  w-10 h-10
                  rounded-lg
                  bg-[#14263a]
                  border border-slate-700
                  flex items-center justify-center
                  text-white
                  hover:bg-[#ff9d17]
                  hover:text-black
                  hover:border-[#ff9d17]
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <Facebook size={18} />
              </a>


              {/* YOUTUBE */}
              <a
                href="https://youtube.com/@vaishnavimarble"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vaishnavi Marble YouTube"
                className="
                  w-10 h-10
                  rounded-lg
                  bg-[#14263a]
                  border border-slate-700
                  flex items-center justify-center
                  text-white
                  hover:bg-[#ff9d17]
                  hover:text-black
                  hover:border-[#ff9d17]
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <Youtube size={19} />
              </a>


              {/* WHATSAPP */}
              <a
                href={whatsappEnquiry(
                  'I have a general enquiry about your products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vaishnavi Marble WhatsApp"
                className="
                  w-10 h-10
                  rounded-lg
                  bg-[#14263a]
                  border border-slate-700
                  flex items-center justify-center
                  text-white
                  hover:bg-green-600
                  hover:border-green-600
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <MessageCircle size={19} />
              </a>

            </div>


            {/* SHOWROOM INFO */}
            <div className="mt-7 space-y-3">

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock
                  size={17}
                  className="text-[#ff9d17] shrink-0"
                />

                <span>
                  Showroom Timings: 9:30 AM - 7:30 PM
                  (Sunday Open)
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Calculator
                  size={17}
                  className="text-[#ff9d17] shrink-0"
                />

                <span>
                  Tile Calculator available in-store
                </span>
              </div>

            </div>

          </div>


          {/* CONTACT FORM */}
          <div>

            {/* COLLAPSED CONTACT HEADER */}
            <button
              type="button"
              onClick={() => setContactOpen(!contactOpen)}
              className="
                w-full
                flex items-center justify-between
                rounded-xl
                bg-[#102236]
                border border-slate-700
                px-5 py-4
                text-left
                hover:border-[#ff9d17]
                hover:bg-[#14263a]
                transition-all duration-300
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-10 h-10
                    rounded-lg
                    bg-[#ff9d17]
                    text-black
                    flex items-center justify-center
                  "
                >
                  <MessageCircle size={20} />
                </div>

                <div>
                  <h3 className="text-white font-bold">
                    Contact Us
                  </h3>

                  <p className="text-xs text-slate-400">
                    Send us your requirement
                  </p>
                </div>

              </div>

              <div
                className={`
                  text-[#ff9d17]
                  transition-transform duration-300
                  ${contactOpen ? 'rotate-180' : ''}
                `}
              >
                <ChevronDown size={22} />
              </div>

            </button>


            {/* ANIMATED FORM */}
            <div
              className={`
                overflow-hidden
                transition-all duration-500 ease-in-out
                ${
                  contactOpen
                    ? 'max-h-[700px] opacity-100 mt-4'
                    : 'max-h-0 opacity-0 mt-0'
                }
              `}
            >

              <div
                className="
                  rounded-xl
                  bg-[#102236]
                  border border-slate-700
                  p-5
                "
              >

                {/* CLOSE */}
                <div className="flex justify-end mb-2">

                  <button
                    type="button"
                    onClick={() => setContactOpen(false)}
                    className="
                      text-slate-500
                      hover:text-white
                      transition-colors
                    "
                    aria-label="Close contact form"
                  >
                    <X size={18} />
                  </button>

                </div>


                <form
                  onSubmit={handleCallback}
                  className="space-y-3"
                >

                  {/* NAME */}
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your Name"
                    className="
                      w-full
                      bg-white
                      text-stone-800
                      rounded-lg
                      px-4 py-3
                      text-sm
                      outline-none
                      border-2 border-transparent
                      focus:border-[#ff9d17]
                      transition-all
                    "
                  />


                  {/* MOBILE */}
                  <input
                    required
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mobile: e.target.value,
                      })
                    }
                    placeholder="Your Mobile Number"
                    className="
                      w-full
                      bg-white
                      text-stone-800
                      rounded-lg
                      px-4 py-3
                      text-sm
                      outline-none
                      border-2 border-transparent
                      focus:border-[#ff9d17]
                      transition-all
                    "
                  />


                  {/* CITY */}
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        city: e.target.value,
                      })
                    }
                    placeholder="City"
                    className="
                      w-full
                      bg-white
                      text-stone-800
                      rounded-lg
                      px-4 py-3
                      text-sm
                      outline-none
                      border-2 border-transparent
                      focus:border-[#ff9d17]
                      transition-all
                    "
                  />


                  {/* MESSAGE */}
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tell us what you need..."
                    className="
                      w-full
                      bg-white
                      text-stone-800
                      rounded-lg
                      px-4 py-3
                      text-sm
                      outline-none
                      resize-none
                      border-2 border-transparent
                      focus:border-[#ff9d17]
                      transition-all
                    "
                  />


                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={submitted}
                    className="
                      w-full
                      flex items-center justify-center gap-2
                      bg-[#ff9d17]
                      text-black
                      py-3
                      rounded-lg
                      font-bold
                      text-sm
                      hover:bg-white
                      hover:-translate-y-0.5
                      active:translate-y-0
                      transition-all duration-300
                      disabled:opacity-70
                    "
                  >

                    {submitted ? (
                      <>
                        <MessageCircle size={18} />
                        Message Sent
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Send on WhatsApp
                      </>
                    )}

                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          BENEFITS STRIP
      ========================================================== */}
      <section className="border-y border-slate-700 bg-[#102236]">

        <div className="max-w-7xl mx-auto px-4 py-7">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div
              className="
                flex items-center gap-3
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <ShieldCheck
                size={28}
                className="text-[#ff9d17] shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Secure Packaging
                </p>

                <p className="text-xs text-slate-400">
                  Safe & damage-proof
                </p>
              </div>
            </div>


            <div
              className="
                flex items-center gap-3
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <Truck
                size={28}
                className="text-[#ff9d17] shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Fast Delivery
                </p>

                <p className="text-xs text-slate-400">
                  Reliable delivery
                </p>
              </div>
            </div>


            <div
              className="
                flex items-center gap-3
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <RefreshCw
                size={28}
                className="text-[#ff9d17] shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Easy Returns
                </p>

                <p className="text-xs text-slate-400">
                  Customer-friendly service
                </p>
              </div>
            </div>


            <div
              className="
                flex items-center gap-3
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <Headphones
                size={28}
                className="text-[#ff9d17] shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Customer Support
                </p>

                <p className="text-xs text-slate-400">
                  Mon-Sat, 9am-7pm
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOOTER LINK GROUPS
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>

              <h4
                className="
                  text-white
                  font-bold
                  text-sm
                  mb-5
                  flex items-center gap-2
                "
              >
                <span className="w-1 h-5 bg-[#ff9d17] rounded-full" />
                {group.title}
              </h4>

              <ul className="space-y-2.5">

                {group.items.map((item) => (
                  <li key={item}>

                    <button
                      type="button"
                      onClick={() => handleSearchLink(item)}
                      className="
                        group
                        flex items-center gap-2
                        text-sm
                        text-slate-400
                        hover:text-[#ff9d17]
                        transition-all duration-200
                        text-left
                      "
                    >

                      <ArrowRight
                        size={13}
                        className="
                          opacity-0
                          -ml-3
                          group-hover:opacity-100
                          group-hover:ml-0
                          transition-all duration-200
                          text-[#ff9d17]
                        "
                      />

                      <span>
                        {item}
                      </span>

                    </button>

                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>

      </section>


      {/* =========================================================
          SHOP / ADMIN / CATEGORY LINKS
      ========================================================== */}
      <section className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* SHOP CATEGORIES */}
            <div>

              <h4 className="text-white font-semibold mb-4 text-sm">
                Shop Categories
              </h4>

              <div className="flex flex-wrap gap-2">

                {categories.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      navigate(`/category/${cat.slug}`)
                    }
                    className="
                      px-3 py-1.5
                      rounded-full
                      bg-[#14263a]
                      border border-slate-700
                      text-xs
                      text-slate-400
                      hover:text-[#ff9d17]
                      hover:border-[#ff9d17]
                      transition-all
                    "
                  >
                    {cat.name}
                  </button>
                ))}

              </div>

            </div>


            {/* QUICK LINKS */}
            <div>

              <h4 className="text-white font-semibold mb-4 text-sm">
                Quick Links
              </h4>

              <div className="flex flex-col gap-2">

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="
                    text-left text-sm text-slate-400
                    hover:text-[#ff9d17]
                    transition-colors
                  "
                >
                  Home
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="
                    text-left text-sm text-slate-400
                    hover:text-[#ff9d17]
                    transition-colors
                  "
                >
                  Cart
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/blog')}
                  className="
                    text-left text-sm text-slate-400
                    hover:text-[#ff9d17]
                    transition-colors
                  "
                >
                  Inspiration & Blog
                </button>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="
                    text-left text-sm text-slate-400
                    hover:text-[#ff9d17]
                    transition-colors
                  "
                >
                  Contact Us
                </button>

              </div>

            </div>


            {/* ADMIN */}
            <div>

              <h4 className="text-white font-semibold mb-4 text-sm">
                Account & Management
              </h4>

              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="
                  group
                  w-full
                  flex items-center justify-between
                  rounded-xl
                  bg-[#14263a]
                  border border-slate-700
                  px-4 py-3
                  text-left
                  hover:border-[#ff9d17]
                  hover:bg-[#172c43]
                  transition-all duration-300
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-9 h-9
                      rounded-lg
                      bg-[#ff9d17]
                      text-black
                      flex items-center justify-center
                      group-hover:scale-105
                      transition-transform
                    "
                  >
                    <UserCog size={18} />
                  </div>

                  <div>

                    <p className="text-white text-sm font-semibold">
                      Admin Login
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage products & categories
                    </p>

                  </div>

                </div>

                <ExternalLink
                  size={17}
                  className="
                    text-slate-500
                    group-hover:text-[#ff9d17]
                    transition-colors
                  "
                />

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CREATED BY
      ========================================================== */}
      <section className="border-t border-slate-700 bg-[#05111c]">

        <div
          className="
            max-w-7xl mx-auto
            px-4 py-5
            flex flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
          "
        >

          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Vaishnavi Marble.
            All rights reserved.
          </p>


          <a
            href="https://www.trexolytetech.in/#home"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              text-xs
              text-slate-400
              hover:text-[#ff9d17]
              transition-colors
              flex items-center gap-1.5
            "
          >
            <span>
              Created by
            </span>

            <span className="font-semibold text-white group-hover:text-[#ff9d17]">
              Trexolyte Tech & IT Solutions
            </span>

            <ExternalLink
              size={12}
              className="
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
                transition-transform
              "
            />
          </a>

        </div>

      </section>

    </footer>
  );
}
