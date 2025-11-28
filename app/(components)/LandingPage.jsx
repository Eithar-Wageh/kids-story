import Image from "next/image";
import Link from "next/link";
import React from "react";

function LandingPage() {
  return (
    <section
      className="flex flex-col-reverse lg:flex-row
    items-center justify-between px-10 bg-[#efd5e2]
    lg:px-32 py-16 mt-5"
    >
      <div className="max-w-lg space-y-6  ">
        <h1
          className="text-4xl font-extrabold 
            text-[#c9749d] leading-tight"
        >
          Generate Your Favourite Story With The Power Of AI
        </h1>
        <p className="text-gray-600">
          Generate uniqe and personalized kids' stories powerd by AI Make story
          time magical and exciting for your children
        </p>

        <Link
          className="bg-[#c9749d] text-white 
px-6 py-3 rounded-lg text-lg font-semibold 
hover:bg-[#c15b8c] transition"
          href="/dashboard/my-stories"
        >
          Create Story
        </Link>

       
      </div>
       <div className="relative w-full h-[500px] ">
          <Image src="/hero.png" alt="hero" fill className="object-contain flex flex-col" />
        </div>
    </section>
  );
}

export default LandingPage;
