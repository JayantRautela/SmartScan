"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTABanner = () => {
    const navigate = useNavigate();
  return (
    <section className="w-full px-4 py-12 md:py-20 bg-blue-600 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center gap-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-base md:text-lg text-white/90 max-w-xl">
          Upload your resume now and get personalized insights to improve your chances.
        </p>
        <Button
          className="bg-white cursor-pointer text-blue-600 hover:bg-gray-200 px-6 py-2 text-sm md:text-base rounded-xl font-semibold transition"
          onClick={() => {
            navigate('/')
            document.getElementById("upload-resume")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Get Started
        </Button>
      </motion.div>
    </section>
  );
};

export default CTABanner;
