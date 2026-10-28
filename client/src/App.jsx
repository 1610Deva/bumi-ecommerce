import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import OurImpact from "./pages/OurImpact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import { useCart } from "./hooks/useCart";

function App() {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isHome = location.pathname === "/";

  // Handles navigation to the homepage's sustainability section.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, location.hash]);

  function submitSearch(event) {
    event.preventDefault();
    const query = searchValue.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setMenuOpen(false);
  }

  const headerTone = isHome ? "text-white" : "text-forest";
  const headerControl = isHome
    ? "border-white/35 bg-white/10 text-white placeholder:text-white/70 focus:border-white"
    : "border-forest/20 bg-white text-forest placeholder:text-forest/50 focus:border-forest";

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header
        className={`z-30 w-full ${isHome ? "absolute inset-x-0 top-0" : "relative border-b border-forest/10 bg-ivory"} ${headerTone}`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-6 md:px-10 lg:px-14">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-[29px] font-semibold tracking-[-0.085em] leading-none"
            aria-label="BUMI home"
          >
            bumi<span className={isHome ? "text-[#e6edcd]" : "text-earth"}>.</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <NavLink
              end
              to="/"
              className={({ isActive }) => `text-[13px] transition-opacity hover:opacity-70 ${isActive ? "font-semibold" : "font-medium"}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => `text-[13px] transition-opacity hover:opacity-70 ${isActive ? "font-semibold" : "font-medium"}`}
            >
              Shop
            </NavLink>
            <Link to="/our-impact" className="text-[13px] font-medium transition-opacity hover:opacity-70">
              Our Approach
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <form onSubmit={submitSearch} role="search" className="relative hidden lg:block">
              <label htmlFor="header-product-search" className="sr-only">Search products</label>
              <input
                id="header-product-search"
                type="search"
                placeholder="Search essentials..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className={`h-10 w-[212px] rounded-full border px-4 pr-10 text-xs outline-none transition-colors ${headerControl}`}
              />
              <button
                aria-label="Submit product search"
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search size={16} />
              </button>
            </form>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${isHome ? "border-white/35 bg-white/10" : "border-forest/20"}`}
              aria-label={`Shopping cart, ${totalItems} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.7} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#e9efcf] px-1 text-[10px] font-bold text-forest">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${isHome ? "border-white/35 bg-white/10" : "border-forest/20"}`}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute inset-x-4 top-[83px] rounded-2xl border border-forest/10 bg-ivory p-5 text-forest shadow-xl md:hidden"
          >
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop collection</Link>
              <Link to="/our-impact" onClick={() => setMenuOpen(false)}>Our approach</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>Shopping cart ({totalItems})</Link>
            </div>
            <form onSubmit={submitSearch} className="mt-5 flex overflow-hidden rounded-full border border-forest/20 bg-white">
              <label htmlFor="mobile-product-search" className="sr-only">Search products</label>
              <input
                id="mobile-product-search"
                type="search"
                placeholder="Search products..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="min-w-0 flex-1 px-4 py-3 text-sm text-forest outline-none"
              />
              <button type="submit" aria-label="Submit search" className="px-4 text-forest"><Search size={17} /></button>
            </form>
          </nav>
        )}
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/our-impact" element={<OurImpact />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/finish" element={<PaymentResult />} />
        <Route path="/payment/error" element={<PaymentResult />} />
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-7xl px-6 py-24">
              <p className="section-eyebrow mb-3">404 / Page not found</p>
              <h1 className="display-font text-5xl text-forest">This page isn't here.</h1>
              <Link to="/shop" className="mt-8 inline-flex items-center gap-2 border-b border-forest pb-1 text-sm text-forest">
                Return to the collection <ArrowUpRight size={16} />
              </Link>
            </main>
          }
        />
      </Routes>

      <footer className="mt-0 bg-ivory px-5 pb-6 pt-16 md:px-10 md:pt-24 lg:px-14">
        <div className="mx-auto max-w-[1328px] border-t border-forest/15 pt-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <p className="section-eyebrow mb-3">Thoughtful living starts with everyday choices</p>
              <p className="max-w-sm text-xl leading-snug text-forest md:text-2xl">
                A little more intentional. <span className="editorial-serif">A little closer to nature.</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-forest/80">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop all</Link>
              <Link to="/our-impact">Our approach</Link>
              <Link to="/cart">Your cart</Link>
            </div>
          </div>
          <p className="mt-14 select-none text-[clamp(92px,18vw,272px)] font-semibold leading-[0.7] tracking-[-0.105em] text-forest/20" aria-label="BUMI">
            bumi<span className="text-earth/50">.</span>
          </p>
          <div className="mt-9 flex flex-col justify-between gap-2 border-t border-forest/10 pt-5 text-xs text-charcoal/55 sm:flex-row">
            <span>© 2026 BUMI. Sustainable Living Store.</span>
            <span>Better choices, better planet.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
