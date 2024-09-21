import HeroCarousel from "@/components/HeroCarousel";
import ProductCards from "@/components/ProductCards";
import SearchBar from "@/components/SearchBar";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";
import React from "react";

const Page = async () => {
  const allProducts = (await getAllProducts()) || [];

  // console.log("all products", allProducts);

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart shopping starts here:{" "}
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="Right arrow icon indicating next step"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Unleash the power of{" "}
              <span className="text-primary">Web Scrapper</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        {(allProducts ?? []).length > 0 ? (
          <div className="flex flex-wrap gap-x-8 gap-y-16">
            {allProducts.map((product) => (
              <ProductCards key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p>No products available.</p>
        )}
      </section>
    </>
  );
};

export default Page;
