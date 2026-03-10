import Image from "next/image";
import Link from "next/link";

export function BrandsBar() {
  const brands = [
    { name: "DuraVent", logo: "/brands/efs-featured/duravent.webp", featuredImage: true },
    { name: "Superior", logo: "/brands/efs-featured/superior.webp", featuredImage: true },
    { name: "Empire", logo: "/brands/efs-featured/empire.webp", featuredImage: true },
    { name: "Majestic", logo: "/brands/efs-featured/majestic.webp", featuredImage: true },
    { name: "Metal-Fab", logo: "/brands/efs-featured/metal-fab.webp", featuredImage: true },
    { name: "Napoleon", logo: "/brands/efs-featured/napoleon.webp", featuredImage: true },
    { name: "Pilgrim", logo: "/brands/efs-featured/pilgrim.webp", featuredImage: true },
    { name: "Kingsman", logo: "/brands/efs-featured/kingsman.webp", featuredImage: true },
    { name: "Real Fyre", logo: "/brands/efs-featured/rh-peterson.webp", featuredImage: true },
    { name: "HPC", logo: "/brands/efs-featured/hearth-products-controls.webp", featuredImage: true },
    { name: "Dagan", logo: "/brands/efs-featured/dagan.webp", featuredImage: true },
    { name: "Monessen", logo: "/brands/efs-featured/monessen.webp", featuredImage: true },
    { name: "Goods of the Woods", logo: "/brands/efs-featured/goods-of-the-woods.webp", featuredImage: true },
    { name: "Hy-C Company", logo: "/brands/efs-featured/hy-c.webp", featuredImage: true },
    { name: "AW Perkins", logo: "/brands/efs-featured/aw-perkins.webp", featuredImage: true },
    { name: "MRCOOL", logo: "/brands/efs-featured/mr--cool.webp", featuredImage: true },
    { name: "Ventis", logo: "/brands/efs-featured/ventis.webp", featuredImage: true },
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
