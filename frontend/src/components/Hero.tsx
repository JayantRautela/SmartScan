import { Button } from "./ui/button"
import hero from "../assets/hero.jpg"
import { useState } from "react";
import UploadResume from "./UploadResume";

const Hero = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="w-full bg-black text-center px-4 py-4 sm:py-8 md:py-12">
      <section className="pt-8 sm:pt-12 md:pt-8">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide leading-snug">
          Examine Your Resume,<br className="hidden sm:block" /> Elevate Your Career
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg my-4 sm:my-6 max-w-2xl mx-auto">
          Unlock your potential with personalized resume analysis and tailored<br className="hidden sm:block" />
          improvement paths. Our service empowers you to stand out in the<br className="hidden sm:block" />
          job market and achieve your career goals.
        </p>
      </section>
      <div className="py-4 sm:py-6">
        <Button 
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-sm sm:text-base px-6 py-2"
          onClick={() => setOpen(true)}
        >
          Upload Resume
        </Button>
        <UploadResume 
          open={open}
          onOpenChange={setOpen}
        />
      </div>
      <div className="text-muted-foreground text-xs sm:text-sm pb-4 sm:pb-6">
        Rated 5/5 from over 500 reviews
      </div>
      <div className="w-full">
        <img src={hero} alt="hero image" className="h-64 sm:h-72 md:h-80 lg:h-96 w-full max-w-[90%] md:max-w-[70%] mx-auto object-cover rounded-xl shadow-lg" />
      </div>
    </div>
  )
}

export default Hero