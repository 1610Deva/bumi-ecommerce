import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Leaf, Recycle, Sprout } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getCategories, getProducts } from "../services/api";

// Editorial/lifestyle photography, sourced from Unsplash (not product listings).
// Product cards use actual product.imageUrl from the BUMI database instead.
const photos = {
  hero: "https://images.unsplash.com/photo-1770989231010-c736f3aeffd2?auto=format&fit=crop&w=1800&q=85",
  story: "https://images.unsplash.com/photo-1774200981075-a728eaaa3824?auto=format&fit=crop&w=1600&q=82",
  drinkware: "https://images.unsplash.com/photo-1730703136456-8bffc44d835c?auto=format&fit=crop&w=760&q=80",
  kitchen: "https://images.unsplash.com/photo-1720415353460-957325a7267d?auto=format&fit=crop&w=760&q=80",
  care: "https://images.unsplash.com/photo-1553691158-91a7f9183156?auto=format&fit=crop&w=760&q=80",
  home: "https://images.unsplash.com/photo-1624377324630-f3f2752ff642?auto=format&fit=crop&w=760&q=80",
  carry: "https://images.unsplash.com/photo-1772890753143-24991d807710?auto=format&fit=crop&w=760&q=80",
};

const categoryMedia = {
  drinkware: { image: photos.drinkware, subtitle: "Made to refill" },
  "kitchen-dining": { image: photos.kitchen, subtitle: "For the everyday table" },
  "kitchen-and-dining": { image: photos.kitchen, subtitle: "For the everyday table" },
  "personal-care": { image: photos.care, subtitle: "Simple daily rituals" },
  "home-essentials": { image: photos.home, subtitle: "A considered home" },
  "everyday-carry": { image: photos.carry, subtitle: "Bring less waste along" },
};

function MediaImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`bg-[#b5c2b1] ${className}`} role="img" aria-label={alt} />;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}

export default function Home() {
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [featured, setFeatured] = useState({ products: [], loading: true, error: false });
  const [categories, setCategories] = useState([]);
  const featuredScrollRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ sort: "newest", signal: controller.signal })
      .then((products) => {
        if (!controller.signal.aborted) {
          setFeatured({ products: products.slice(0, 8), loading: false, error: false });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Homepage products:", error);
          setFeatured({ products: [], loading: false, error: true });
        }
      });

    getCategories(controller.signal)
      .then((data) => { if (!controller.signal.aborted) setCategories(data); })
      .catch((error) => { if (!controller.signal.aborted) console.error("Homepage categories:", error); });

    return () => controller.abort();
  }, []);

  function moveFeatured(direction) {
    featuredScrollRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  return (
    <main>
      {/* 01 — Photo-led hero. Navbar from App.jsx sits over this section. */}
      <section className="home-hero relative isolate flex min-h-[660px] items-end overflow-hidden bg-[#193d32] px-5 pb-16 pt-40 text-white sm:min-h-[730px] md:px-10 md:pb-20 lg:min-h-[790px] lg:px-14">
        {/* Explicit positive stacking levels prevent the photograph from disappearing behind the page background. */}
        {!heroImageFailed && (
          <img
            src={photos.hero}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
            onError={() => {
              console.warn("BUMI hero photograph could not be loaded:", photos.hero);
              setHeroImageFailed(true);
            }}
          />
        )}
        {/* Forest green remains visible if the remote photo fails. */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#09251e]/85 via-[#09251e]/50 to-[#09251e]/20" aria-hidden="true" />
        <div className="relative z-20 mx-auto flex w-full max-w-[1328px] flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
          <div className="max-w-[760px]">
            <p className="section-eyebrow mb-6 text-white/85">A better everyday begins here</p>
            <h1 className="text-[clamp(52px,7vw,110px)] font-medium leading-[0.97] tracking-[-0.075em]">
              Good things.<br />
              <span className="editorial-serif font-normal tracking-[-0.05em]">Lighter living.</span>
            </h1>
            <p className="mt-7 max-w-[435px] text-sm leading-7 text-white/85 md:text-base">
              Discover reusable essentials and everyday favorites, thoughtfully selected for the way we live.
            </p>
            <Link to="/shop" className="mt-9 inline-flex items-center gap-4 rounded-full bg-[#f2f3d9] px-6 py-3.5 text-sm font-semibold text-forest transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Shop the collection <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="hidden max-w-[195px] border-l border-white/40 pl-5 lg:block">
            <Sprout className="mb-7" size={31} strokeWidth={1.2} />
            <p className="text-base leading-6">A little less waste.<br /><span className="editorial-serif text-xl">A little more intention.</span></p>
            <p className="mt-7 text-xs text-white/65">01 / 04 — BUMI Journal</p>
          </div>
        </div>
        <a href="#daily-edit" aria-label="Scroll to featured products" className="absolute bottom-7 right-6 z-20 text-white/85 md:right-14"><ArrowDown size={22} strokeWidth={1.4} /></a>
      </section>

      {/* 02 — Dynamically loaded products */}
      <section id="daily-edit" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow mb-3 text-earth">Curated essentials / 001</p>
            <h2 className="max-w-xl text-[clamp(36px,4.2vw,62px)] leading-[1.06] tracking-[-0.065em] text-forest">
              The daily <span className="editorial-serif tracking-normal">edit.</span>
            </h2>
            <p className="mt-4 text-sm text-charcoal/65">Thoughtful choices for moments big and small.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => moveFeatured(-1)} aria-label="Scroll featured products left" className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/25 text-forest transition-colors hover:bg-forest hover:text-white"><ArrowLeft size={17} /></button>
            <button type="button" onClick={() => moveFeatured(1)} aria-label="Scroll featured products right" className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/25 text-forest transition-colors hover:bg-forest hover:text-white"><ArrowRight size={17} /></button>
            <Link to="/shop" className="ml-3 inline-flex items-center gap-2 border-b border-forest pb-1 text-xs font-semibold text-forest hover:opacity-70">View all <ArrowUpRight size={14} /></Link>
          </div>
        </div>

        {featured.loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" role="status" aria-label="Loading featured products">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse"><div className="aspect-[4/5] rounded-xl bg-forest/10" /><div className="mt-4 h-4 w-3/4 rounded bg-forest/10" /><div className="mt-3 h-4 w-1/3 rounded bg-forest/10" /></div>
            ))}
          </div>
        ) : featured.error ? (
          <p className="rounded-lg border border-forest/15 px-6 py-10 text-sm text-forest">Products are unavailable right now. <Link to="/shop" className="underline underline-offset-4">Try the collection</Link>.</p>
        ) : featured.products.length ? (
          <div ref={featuredScrollRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
            {featured.products.map((product) => (
              <div key={product.id} className="w-[76vw] max-w-[330px] shrink-0 snap-start sm:w-[42vw] lg:w-[calc(25%_-_12px)] lg:max-w-none">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-charcoal/65">No featured products are available at the moment.</p>
        )}
      </section>

      {/* 03 — Lifestyle brand story */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <div className="relative flex min-h-[390px] items-end overflow-hidden rounded-[4px] bg-[#4d6655] p-7 text-white md:min-h-[550px] md:p-14">
          <MediaImage src={photos.story} alt="Warm contemporary living space with natural materials" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102c23]/85 via-[#102c23]/20 to-transparent" aria-hidden="true" />
          <div className="relative max-w-[690px]">
            <p className="section-eyebrow mb-4 text-white/75">Made for the life you live</p>
            <h2 className="text-[clamp(31px,4vw,59px)] font-medium leading-[1.12] tracking-[-0.06em]">
              The everyday can feel <span className="editorial-serif font-normal tracking-normal">extraordinary</span> when we choose with care.
            </h2>
          </div>
        </div>
      </section>

      {/* 04 — Values without unverified environmental claims */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-5 py-12 sm:grid-cols-3 md:px-10 md:py-14 lg:px-14">
        {[
          { icon: Recycle, title: "Reuse by design", body: "Simple swaps for repeated use." },
          { icon: Leaf, title: "Conscious choices", body: "Consider what you bring home." },
          { icon: Sprout, title: "Everyday habits", body: "Make room for small changes." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex min-h-[120px] items-center gap-5 rounded-xl bg-[#e9eddf] px-6 py-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory text-forest"><Icon size={22} strokeWidth={1.4} /></span>
            <div>
              <h3 className="editorial-serif text-[25px] leading-tight text-forest">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-forest/65">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 05 — Real categories from the API */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-7 md:px-10 md:pb-32 lg:px-14">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow mb-3 text-earth">Find your everyday favorite / 002</p>
            <h2 className="text-[clamp(36px,4.2vw,62px)] leading-[1.06] tracking-[-0.065em] text-forest">
              Shop by <span className="editorial-serif tracking-normal">category.</span>
            </h2>
          </div>
          <Link to="/shop" className="inline-flex w-fit items-center gap-2 border-b border-forest pb-1 text-xs font-semibold text-forest hover:opacity-70">Explore all products <ArrowUpRight size={14} /></Link>
        </div>

        {categories.length ? (
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const media = categoryMedia[category.slug] || { image: photos.story, subtitle: "Explore the collection" };
              return (
                <Link key={category.id} to={`/shop?category=${encodeURIComponent(category.slug)}`} className="group relative h-[340px] w-[72vw] max-w-[285px] shrink-0 snap-start overflow-hidden rounded-[3px] bg-sage sm:w-[40vw] md:h-[395px] lg:w-[calc(20%_-_10px)] lg:max-w-none">
                  <MediaImage src={media.image} alt={`Lifestyle photography for ${category.name}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-5 bottom-6 text-white">
                    <p className="mb-2 text-[10px] uppercase tracking-[.14em] text-white/75">{media.subtitle}</p>
                    <h3 className="editorial-serif max-w-[190px] text-3xl leading-[1.03]">{category.name}</h3>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f2f3d9] px-4 py-2 text-[11px] font-semibold text-forest">Explore <ArrowUpRight size={13} /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-36 items-center justify-between gap-5 border-t border-forest/15 py-8">
            <p className="text-sm text-charcoal/65">Browse the full range of BUMI everyday essentials.</p>
            <Link to="/shop" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-forest">Browse shop <ArrowUpRight size={15} /></Link>
          </div>
        )}
      </section>

      {/* 06 — A concrete sustainability commitment, without fabricated metrics */}
      <section id="impact" className="scroll-mt-8 bg-forest px-5 py-20 text-ivory md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1328px] gap-12 md:grid-cols-[1.35fr_1fr] md:items-end">
          <div>
            <p className="section-eyebrow mb-6 text-[#bcccb7]">Beyond the purchase / Our approach</p>
            <h2 className="max-w-[720px] text-[clamp(44px,6.2vw,88px)] leading-[0.99] tracking-[-0.07em]">
              Less excess.<br /><span className="editorial-serif tracking-normal text-[#dbe7c6]">More intention.</span>
            </h2>
          </div>
          <div className="max-w-[430px]">
            <p className="text-sm leading-7 text-[#e3e8dd]/85">
              BUMI curates everyday essentials that encourage reuse and more mindful consumption. Our approach takes inspiration from the UN Sustainable Development Goals.
            </p>
            <Link to="/our-impact" className="mt-7 inline-flex items-center gap-2 border-b border-white/75 pb-1 text-sm font-semibold text-white hover:opacity-70">Explore our approach <ArrowUpRight size={16} /></Link>
            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-white/20 pt-6">
              <div><p className="editorial-serif text-3xl">12</p><p className="mt-2 text-xs leading-5 text-white/70">Responsible consumption & production</p></div>
              <div><p className="editorial-serif text-3xl">13</p><p className="mt-2 text-xs leading-5 text-white/70">Climate action</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
