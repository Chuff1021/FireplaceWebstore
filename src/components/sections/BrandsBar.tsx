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
    { name: "FireplaceX", logo: "/brands/fireplacex.png" },
    { name: "Lopi", logo: "/brands/lopi.png" },
  ];

  return (
    <section className="bg-white py-12 text-center md:py-[60px] xl:py-20" id="featured-brands">
      <div className="mx-auto max-w-[1640px] px-4 md:px-5">
        <h2 className="mb-8 text-[32px] font-normal leading-[1.13] tracking-[0.24px] text-[#212121] md:mb-10 xl:mb-12">
          Featured Brands
        </h2>

        <div className="flex flex-wrap justify-center gap-x-0 gap-y-0 border border-[#e0e0e0] border-b-0 border-r-0">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/search?q=${encodeURIComponent(brand.name)}`}
              className="group flex h-[123px] w-1/2 items-center justify-center border-b border-r border-[#e0e0e0] bg-white px-[9.5px] py-4 transition-colors duration-300 hover:bg-[#faf7f2] md:w-1/3 xl:w-[20%]"
            >
              <div className="relative h-full w-full">
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

        <Link
          href="/search"
          className="mt-7 inline-block text-sm leading-7 tracking-[0.44px] text-[#212121] underline underline-offset-4 md:mt-8"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
