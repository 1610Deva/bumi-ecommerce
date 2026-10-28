import { Link } from "react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleHelp,
  Earth,
  Leaf,
  Recycle,
  Repeat2,
  Sprout,
} from "lucide-react";

const image = (slug) => `/images/products/${slug}.webp`;

const habits = [
  {
    number: "01",
    title: "Carry what you already have.",
    description:
      "Bring a reusable bottle, tote, or cutlery set when you know you will need it. Reuse items you already own before buying something new.",
  },
  {
    number: "02",
    title: "Choose for repeated use.",
    description:
      "Look for an item that fits your routine, is easy to clean, and can be maintained. A reusable product only makes sense when it is actually reused.",
  },
  {
    number: "03",
    title: "Make the most of each purchase.",
    description:
      "Repair, refill, and care for products where practical. Avoid replacing a working item just because a newer option is available.",
  },
  {
    number: "04",
    title: "Stay curious about the impact.",
    description:
      "Check materials and care instructions. Claims about carbon savings or environmental superiority need evidence, including how a product is made and used.",
  },
];

const practices = [
  {
    eyebrow: "01 / REUSE",
    title: "Bring your own,",
    accent: "again and again.",
    description:
      "A bottle or coffee cup becomes a useful alternative to single-use packaging when it becomes part of your daily routine.",
    image: "stainless-tumbler",
    alt: "BUMI reusable stainless tumbler in sage green",
    caption: "Stainless Tumbler",
    href: "/products/stainless-tumbler",
    background: "#E4E5D8",
  },
  {
    eyebrow: "02 / REFILL & CARE",
    title: "Build habits that",
    accent: "last longer.",
    description:
      "Think beyond the first use: refill where possible, clean items properly, and extend their useful life before purchasing replacements.",
    image: "refillable-soap-dispenser",
    alt: "BUMI refillable soap dispenser on a neutral background",
    caption: "Refillable Soap Dispenser",
    href: "/products/refillable-soap-dispenser",
    background: "#E9E6DD",
  },
  {
    eyebrow: "03 / EVERYDAY ESSENTIALS",
    title: "A little more",
    accent: "intentional.",
    description:
      "Small routines—like carrying your own bag or food container—are opportunities to consume more thoughtfully, without promising instant climate results.",
    image: "canvas-tote-bag",
    alt: "BUMI canvas tote bag with greenery",
    caption: "Canvas Tote Bag",
    href: "/products/canvas-tote-bag",
    background: "#E0E6D9",
  },
];

function SectionEyebrow({ children, light = false }) {
  return (
    <p className={`section-eyebrow ${light ? "text-[#c9d8be]" : "text-earth"}`}>
      {children}
    </p>
  );
}

function GoalCard({ number, heading, description, targets, theme }) {
  const dark = theme === "dark";
  return (
    <article
      className={`flex h-full min-h-[490px] flex-col overflow-hidden rounded-[3px] p-7 sm:p-10 lg:p-12 ${
        dark ? "bg-forest text-ivory" : "bg-[#EAE8D9] text-forest"
      }`}
    >
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className={`section-eyebrow ${dark ? "text-[#c8d6c2]" : "text-forest/60"}`}>
            UNITED NATIONS / SUSTAINABLE DEVELOPMENT GOAL
          </p>
          <p className="mt-5 text-[clamp(76px,10vw,132px)] font-medium leading-[0.85] tracking-[-0.09em]">
            {number}
          </p>
        </div>
        {dark ? <Earth size={34} strokeWidth={1.15} /> : <Recycle size={34} strokeWidth={1.15} />}
      </div>
      <div className="mt-auto">
        <h3 className="max-w-[480px] text-[clamp(33px,3.4vw,50px)] leading-[1.07] tracking-[-0.06em]">
          {heading}
        </h3>
        <p className={`mt-5 max-w-[430px] text-sm leading-7 ${dark ? "text-ivory/75" : "text-forest/75"}`}>
          {description}
        </p>
        <div className={`mt-8 space-y-3 border-t pt-6 ${dark ? "border-white/20" : "border-forest/15"}`}>
          {targets.map((item) => (
            <p key={item.label} className="grid grid-cols-[54px_1fr] gap-3 text-xs leading-6 sm:text-sm">
              <span className="font-semibold">{item.label}</span>
              <span className={dark ? "text-ivory/75" : "text-forest/75"}>{item.text}</span>
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function OurImpact() {
  return (
    <main className="overflow-hidden bg-ivory">
      {/* HERO */}
      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-14">
        <div>
          <SectionEyebrow>Our approach / A better everyday</SectionEyebrow>
          <h1 className="mt-8 max-w-[790px] text-[clamp(59px,7.5vw,116px)] font-medium leading-[0.93] tracking-[-0.08em] text-forest">
            Small choices.
            <br />
            <span className="editorial-serif font-normal tracking-[-0.035em]">Longer horizons.</span>
          </h1>
          <p className="mt-8 max-w-[530px] text-sm leading-8 text-charcoal/70 md:text-base">
            Thoughtful living isn’t about buying more things labeled “green.” It begins with what we choose, how often we use it, and what we can avoid wasting.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="#our-focus"
              className="inline-flex items-center gap-3 rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#285544] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
            >
              Our focus <ArrowDown size={17} />
            </a>
            <Link to="/shop" className="inline-flex items-center gap-2 border-b border-forest pb-1 text-sm font-semibold text-forest hover:opacity-70">
              Explore essentials <ArrowUpRight size={17} />
            </Link>
          </div>
          <p className="mt-12 flex items-center gap-3 text-xs text-charcoal/50">
            <Leaf size={17} strokeWidth={1.5} /> Better habits, without exaggerated promises.
          </p>
        </div>
        <div className="relative grid min-h-[460px] grid-cols-[1fr_0.75fr] items-end gap-3 sm:min-h-[570px] sm:gap-5" aria-label="BUMI sustainable everyday essentials">
          <figure className="relative h-[92%] overflow-hidden rounded-[3px] bg-[#E5E2D7]">
            <img
              src={image("canvas-tote-bag")}
              alt="Reusable canvas tote bag with foliage"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1.5 text-[10px] font-medium text-forest backdrop-blur-sm sm:bottom-5 sm:left-5">
              Everyday carry
            </figcaption>
          </figure>
          <div className="flex h-full flex-col gap-3 sm:gap-5">
            <figure className="relative h-[57%] overflow-hidden rounded-[3px] bg-[#E5E2D7]">
              <img
                src={image("reusable-coffee-cup")}
                alt="Reusable coffee cup in natural studio lighting"
                className="h-full w-full object-cover"
              />
            </figure>
            <figure className="relative h-[43%] overflow-hidden rounded-[3px] bg-[#E5E2D7]">
              <img
                src={image("bamboo-cutlery-set")}
                alt="Reusable bamboo cutlery set on a linen surface"
                className="h-full w-full object-cover"
              />
            </figure>
          </div>
          <div className="absolute -bottom-5 left-[7%] hidden items-center gap-3 bg-[#E4E9D9] px-6 py-5 text-forest shadow-sm sm:flex">
            <Sprout size={25} strokeWidth={1.3} />
            <span className="editorial-serif text-2xl">Use what matters.</span>
          </div>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="border-y border-forest/10 bg-[#EEEEE5] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1328px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionEyebrow>Beyond the label / 001</SectionEyebrow>
            <p className="mt-5 text-sm leading-7 text-forest/65">Why our approach begins before the purchase.</p>
          </div>
          <div>
            <h2 className="max-w-[780px] text-[clamp(38px,4.5vw,68px)] leading-[1.08] tracking-[-0.065em] text-forest">
              Sometimes, the most thoughtful choice is <span className="editorial-serif tracking-normal">using what you already own.</span>
            </h2>
            <p className="mt-7 max-w-[700px] text-sm leading-8 text-charcoal/70 md:text-base">
              BUMI is a curated e-commerce concept exploring everyday products that can support repeated use and lower-waste routines. Buying a reusable item is not a guaranteed environmental benefit: its real impact depends on materials, production, transport, and how long it is used.
            </p>
          </div>
        </div>
      </section>

      {/* SDGS */}
      <section id="our-focus" className="scroll-mt-12 mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <SectionEyebrow>Our guiding framework / 002</SectionEyebrow>
            <h2 className="mt-5 text-[clamp(39px,5vw,72px)] leading-[1.04] tracking-[-0.07em] text-forest">
              Two goals. <span className="editorial-serif tracking-normal">One direction.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-charcoal/65">
            BUMI takes inspiration from the UN Sustainable Development Goals—especially goals 12 and 13.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <GoalCard
            number="12"
            heading="Responsible Consumption & Production"
            description="Goal 12 focuses on making consumption and production patterns more sustainable. In BUMI, we connect that idea with reuse, waste prevention, and purchasing thoughtfully."
            targets={[
              { label: "12.5", text: "Waste prevention, reduction, recycling and reuse." },
              { label: "12.8", text: "Information and awareness for sustainable lifestyles." },
            ]}
            theme="light"
          />
          <GoalCard
            number="13"
            heading="Climate Action"
            description="Goal 13 calls for urgent action on climate change. BUMI contributes to the conversation through accessible information about everyday habits—not by claiming measured emission reductions."
            targets={[
              { label: "13.3", text: "Education and awareness about climate change and its impacts." },
            ]}
            theme="dark"
          />
        </div>
        <p className="mt-6 text-xs leading-6 text-charcoal/55">
          Alignment with SDG themes is an educational design choice, not UN endorsement or proof of verified environmental impact.
        </p>
      </section>

      {/* PRODUCT-LED PRACTICE */}
      <section className="bg-[#F0EFE8] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1328px]">
          <div className="mb-12 max-w-[700px]">
            <SectionEyebrow>From intention to routine / 003</SectionEyebrow>
            <h2 className="mt-5 text-[clamp(40px,5vw,74px)] leading-[1.04] tracking-[-0.07em] text-forest">
              Make the everyday <span className="editorial-serif tracking-normal">count.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-charcoal/65">Not every product is right for every person. These examples show how reusability can fit into daily routines.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {practices.map((practice) => (
              <article key={practice.eyebrow} className="flex h-full flex-col bg-ivory">
                <Link to={practice.href} className="group relative block aspect-[4/4.4] overflow-hidden" style={{ backgroundColor: practice.background }}>
                  <img src={image(practice.image)} alt={practice.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-ivory/95 px-4 py-2 text-xs font-medium text-forest">{practice.caption}</span>
                </Link>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <SectionEyebrow>{practice.eyebrow}</SectionEyebrow>
                  <h3 className="mt-5 text-[clamp(28px,2.6vw,39px)] leading-[1.09] tracking-[-0.055em] text-forest">
                    {practice.title} <span className="editorial-serif tracking-normal">{practice.accent}</span>
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-charcoal/65">{practice.description}</p>
                  <Link to={practice.href} className="mt-auto inline-flex items-center gap-2 self-start border-b border-forest pb-1 pt-8 text-xs font-semibold text-forest hover:opacity-70">
                    View the product <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HABITS */}
      <section className="bg-forest px-5 py-20 text-ivory md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1328px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionEyebrow light>Living with intention / 004</SectionEyebrow>
            <h2 className="mt-6 text-[clamp(43px,5.4vw,77px)] leading-[1.02] tracking-[-0.075em]">
              Four habits to <span className="editorial-serif font-normal tracking-normal text-[#d7e3c8]">keep close.</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-8 text-ivory/70">The choices that matter most often happen outside a shopping cart. Start with the habits you can actually sustain.</p>
            <div className="mt-12 flex items-center gap-4 text-[#d7e3c8]">
              <Repeat2 size={29} strokeWidth={1.2} />
              <Recycle size={29} strokeWidth={1.2} />
              <BookOpen size={29} strokeWidth={1.2} />
            </div>
          </div>
          <div className="divide-y divide-white/20 border-y border-white/20">
            {habits.map((habit) => (
              <details key={habit.number} className="group py-6 open:pb-7">
                <summary className="flex cursor-pointer list-none items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4edd4] [&::-webkit-details-marker]:hidden">
                  <span className="w-8 shrink-0 text-xs text-ivory/55">{habit.number}</span>
                  <span className="flex-1 text-xl leading-snug tracking-[-0.035em] md:text-2xl">{habit.title}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-xl leading-none transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-lg pl-12 pr-10 pt-5 text-sm leading-8 text-ivory/70">{habit.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionEyebrow>Honest by design / 005</SectionEyebrow>
            <h2 className="mt-5 text-[clamp(43px,5vw,74px)] leading-[1.03] tracking-[-0.07em] text-forest">
              We believe in <span className="editorial-serif tracking-normal">clearer claims.</span>
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-8 text-charcoal/70">
              BUMI is a demonstration e-commerce project. Our product imagery is illustrative, and we have not independently measured the environmental footprint of individual products or customer purchases.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-8 text-charcoal/70">
              A sustainability claim should be supported by appropriate product and supply-chain evidence. Until that exists, we focus on practical reuse and informed decisions rather than promising quantified outcomes.
            </p>
          </div>
          <div className="self-center border-y border-forest/15">
            {[
              { title: "No invented carbon savings", detail: "We do not present unmeasured CO₂ reductions as achieved results." },
              { title: "No unverified certification", detail: "We do not imply BUMI products have third-party sustainability certifications." },
              { title: "No assumption that buying is always better", detail: "Keeping and reusing a product you already own can be the more thoughtful choice." },
            ].map((statement) => (
              <div key={statement.title} className="flex gap-4 border-b border-forest/15 py-7 last:border-b-0">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7eddf] text-forest"><Check size={17} /></span>
                <div>
                  <h3 className="text-base font-semibold text-forest">{statement.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-charcoal/65">{statement.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 border-t border-forest/15 pt-8">
          <div className="flex items-center gap-3"><CircleHelp size={19} className="text-earth" /><p className="section-eyebrow text-earth">Learn from the source</p></div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal/65">The SDG descriptions and target references on this page are based on the United Nations Department of Economic and Social Affairs.</p>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a href="https://sdgs.un.org/goals/goal12" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border-b border-forest pb-1 text-forest hover:opacity-70">UN Goal 12 <ArrowUpRight size={14}/></a>
            <a href="https://sdgs.un.org/goals/goal13" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border-b border-forest pb-1 text-forest hover:opacity-70">UN Goal 13 <ArrowUpRight size={14}/></a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-20 md:px-10 md:pb-28 lg:px-14">
        <div className="mx-auto flex max-w-[1328px] flex-col items-start justify-between gap-8 bg-[#e7ebdc] p-8 md:flex-row md:items-end md:p-14">
          <div>
            <p className="section-eyebrow text-earth">The everyday edit</p>
            <h2 className="mt-5 text-[clamp(39px,5.4vw,76px)] leading-[1.02] tracking-[-0.07em] text-forest">
              Less excess. <span className="editorial-serif tracking-normal">More intention.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-charcoal/65">Find practical essentials that fit your routine—and buy only what you will use.</p>
          </div>
          <Link to="/shop" className="inline-flex shrink-0 items-center gap-4 rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#285544] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest">
            Explore collection <ArrowRight size={17}/>
          </Link>
        </div>
      </section>
    </main>
  );
}
