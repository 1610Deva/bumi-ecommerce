import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getCategories, getProducts } from "../services/api";

function ProductResults({ category, search, sort }) {
  const [result, setResult] = useState({ products: [], loading: true, error: "" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ category, search, sort, signal: controller.signal })
      .then((products) => {
        if (!controller.signal.aborted) setResult({ products, loading: false, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ products: [], loading: false, error: error.message });
      });

    return () => controller.abort();
  }, [category, search, sort, retry]);

  if (result.loading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-5" role="status" aria-label="Loading products">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[4/5] rounded bg-forest/10" />
            <div className="mt-4 h-4 w-3/4 rounded bg-forest/10" />
            <div className="mt-3 h-4 w-1/3 rounded bg-forest/10" />
          </div>
        ))}
      </div>
    );
  }

  if (result.error) {
    return (
      <div role="alert" className="border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-800">
        <p>Unable to load products: {result.error}</p>
        <button
          type="button"
          onClick={() => { setResult({ products: [], loading: true, error: "" }); setRetry((count) => count + 1); }}
          className="mt-4 font-semibold underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="mb-7 text-xs text-charcoal/60" aria-live="polite">{result.products.length} products found</p>
      {result.products.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
          {result.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="border border-forest/15 bg-white px-6 py-20 text-center">
          <p className="display-font text-4xl text-forest">Nothing quite like that.</p>
          <p className="mt-4 text-sm text-charcoal/60">Try another search or explore the full collection.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 border-b border-forest pb-1 text-xs font-semibold text-forest">
            View all products <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "name";

  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const controller = new AbortController();

    getCategories(controller.signal)
      .then((data) => { if (!controller.signal.aborted) setCategories(data); })
      .catch((error) => { if (!controller.signal.aborted) console.error("Categories error:", error); });

    return () => controller.abort();
  }, []);

  function updateParam(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next);
  }

  function handleSearch(event) {
    event.preventDefault();
    updateParam("search", searchInput.trim());
  }

  return (
    <main className="pb-24">
      <section className="border-b border-forest/10 bg-[#e8eadf] px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mx-auto flex max-w-[1328px] flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow mb-4 text-earth">Everyday essentials / BUMI collection</p>
            <h1 className="text-[clamp(50px,7vw,96px)] leading-[0.97] tracking-[-0.073em] text-forest">
              Small things.<br /><span className="editorial-serif tracking-normal">Good changes.</span>
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-7 text-forest/70">Explore thoughtfully selected essentials for more conscious everyday routines.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pt-12 md:px-10 md:pt-16 lg:px-14">
        <div className="mb-7 flex items-center gap-2 text-xs text-charcoal/55">
          <Link to="/" className="hover:text-forest">Home</Link>
          <span>/</span>
          <span className="text-forest">Shop</span>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter products by category">
          <button
            type="button"
            aria-pressed={!category}
            onClick={() => updateParam("category", "")}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-colors ${!category ? "bg-forest text-white" : "border border-forest/20 text-forest hover:bg-forest/5"}`}
          >
            All essentials
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.slug}
              onClick={() => updateParam("category", item.slug)}
              className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-colors ${category === item.slug ? "bg-forest text-white" : "border border-forest/20 text-forest hover:bg-forest/5"}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="mb-9 flex flex-col justify-between gap-4 border-b border-forest/15 pb-7 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} role="search" className="flex w-full max-w-md items-center overflow-hidden rounded-full border border-forest/20 bg-white">
            <Search size={17} className="ml-4 shrink-0 text-forest/60" />
            <label htmlFor="shop-product-search" className="sr-only">Search collection</label>
            <input
              id="shop-product-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="What are you looking for?"
              className="min-w-0 flex-1 px-3 py-3 text-sm text-charcoal outline-none"
            />
            <button type="submit" className="mr-1 rounded-full bg-forest px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#102b22]">Search</button>
          </form>

          <div className="flex items-center gap-3 text-forest">
            <SlidersHorizontal size={17} strokeWidth={1.6} />
            <label htmlFor="sort-products" className="text-xs font-medium">Sort by</label>
            <select
              id="sort-products"
              value={sort}
              onChange={(event) => updateParam("sort", event.target.value === "name" ? "" : event.target.value)}
              className="max-w-[210px] rounded-full border border-forest/20 bg-white px-4 py-2.5 text-xs outline-none"
            >
              <option value="name">Name: A–Z</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <ProductResults key={`${category}|${search}|${sort}`} category={category} search={search} sort={sort} />
      </section>
    </main>
  );
}
