import Image from "next/image";
import Link from "next/link";

export function BrandsBar() {
  const brands = [
    { name: "Napoleon", logo: "/brands/napoleon.webp" },
    { name: "Superior", logo: "/brands/superior.webp" },
    { name: "Dimplex", logo: "/brands/dimplex.webp" },
    { name: "Majestic", logo: "/brands/majestic.webp" },
    { name: "Empire", logo: "/brands/empire.webp" },
    { name: "Osburn", logo: "/brands/osburn.webp" },
    { name: "Drolet", logo: "/brands/drolet.webp" },
    { name: "Buck Stove", logo: "/brands/buck-stove.webp" },
    { name: "Amantii", logo: "/brands/amantii.webp" },
  ];

  return (
    <section className="border-b border-[#dfd8cd] bg-white py-12 md:py-14">
      <div className="mx-auto max-w-[1640px] px-4 md:px-5">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a54210]">
              Featured Brands
            </p>
            <h2 className="mt-2 text-2xl font-normal text-[#1f1f1f] md:text-[32px]">
              Shop the manufacturers behind the products on the site.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#5f605c]">
            These are shown as logo cards instead of plain text so the section feels closer to the marketplace-style homepage you referenced.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/search?q=${encodeURIComponent(brand.name)}`}
              className="group flex min-h-[110px] items-center justify-center border border-[#ded7cb] bg-[#fcfaf7] p-4 transition-all duration-300 hover:border-[#c46b33] hover:bg-white hover:shadow-[0_14px_34px_rgba(52,32,16,0.08)]"
            >
              <div className="relative h-[64px] w-full">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
