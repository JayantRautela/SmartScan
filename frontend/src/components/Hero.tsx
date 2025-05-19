import { Button } from "./ui/button";
import hero from "../assets/hero.jpg";
import { useState } from "react";
import UploadResume from "./UploadResume";
import { motion } from "framer-motion";

const Hero = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full bg-black text-center px-4 py-4 sm:py-8 md:py-12 overflow-hidden">
      <motion.section
        className="pt-8 sm:pt-12 md:pt-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide leading-snug"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Examine Your Resume,
          <br className="hidden sm:block" /> Elevate Your Career
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-sm sm:text-base md:text-lg my-4 sm:my-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Unlock your potential with personalized resume analysis and tailored
          <br className="hidden sm:block" />
          improvement paths. Our service empowers you to stand out in the
          <br className="hidden sm:block" />
          job market and achieve your career goals.
        </motion.p>
      </motion.section>

      <motion.div
        className="py-4 sm:py-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-sm sm:text-base px-6 py-2"
          onClick={() => setOpen(true)}
        >
          Upload Resume
        </Button>
        <UploadResume open={open} onOpenChange={setOpen} />
      </motion.div>

      <motion.div
        className="text-muted-foreground text-xs sm:text-sm pb-4 sm:pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        Rated 5/5 from over 500 reviews
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <img
          src={hero}
          alt="hero image"
          className="h-64 sm:h-72 md:h-80 lg:h-96 w-full max-w-[90%] md:max-w-[70%] mx-auto object-cover rounded-xl shadow-lg"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
