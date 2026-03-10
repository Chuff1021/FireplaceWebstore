import Image from "next/image";
import Link from "next/link";

export function BrandsBar() {
  const brands = [
    { name: "Napoleon", logo: "/brands/napoleon.webp", featuredImage: true },
    { name: "Superior", logo: "/brands/superior.webp", featuredImage: true },
    { name: "Dimplex", logo: "/brands/dimplex.webp", featuredImage: true },
    { name: "Majestic", logo: "/brands/majestic.webp", featuredImage: true },
    { name: "Empire", logo: "/brands/empire.webp", featuredImage: true },
    { name: "Osburn", logo: "/brands/osburn.webp", featuredImage: true },
    { name: "Drolet", logo: "/brands/drolet.webp", featuredImage: true },
    { name: "Buck Stove", logo: "/brands/buck-stove.webp", featuredImage: true },
    { name: "Amantii", logo: "/brands/amantii.webp", featuredImage: true },
    { name: "FireplaceX", logo: "/brands/fireplacex.png", featuredImage: false },
    { name: "Lopi", logo: "/brands/lopi.png", featuredImage: false },
  ];

  return (
    <section className="bg-white py-12 text-center md:py-[60px] xl:py-20" id="featured-brands">
      <div className="mx-auto max-w-[1640px] px-4 md:px-5">
        <h2 className="mb-8 text-[32px] font-normal leading-[1.13] tracking-[0.24px] text-[#212121] md:mb-10 xl:mb-12">
          Featured Brands
        </h2>

        <div className="mx-auto flex max-w-[1145px] flex-wrap justify-center">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/search?q=${encodeURIComponent(brand.name)}`}
              className="group -ml-px -mt-px flex h-[123px] w-1/2 items-center justify-center border border-[#e0e0e0] bg-white px-[9.5px] py-4 transition-colors duration-300 hover:bg-[#faf7f2] md:w-1/3 xl:w-[209px]"
            >
              <div className={`relative w-full ${brand.featuredImage ? "h-full" : "h-[76px]"}`}>
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
