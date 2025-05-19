import Navbar from '@/components/shared/Navbar';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import logo from "../assets/logo.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 sm:px-8 md:px-16 py-12 space-y-20">
        <Navbar />
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-4">About SmartScan</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Revolutionizing document intelligence through advanced scanning, AI, and seamless user experience.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-10 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        variants={fadeInUp}
      >
        <img
          src={logo}
          alt="Our Story"
          className="rounded-2xl shadow-lg w-full"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            SmartScan was born from a simple idea: make document handling smarter, faster, and user-friendly. Since 2023, our mission has been to empower individuals and businesses by transforming traditional document workflows using cutting-edge OCR, AI, and intelligent categorization.
          </p>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="bg-blue-50 rounded-2xl p-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-semibold mb-3 text-blue-700">Our Mission</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          To provide the most efficient, secure, and intuitive scanning experience on the market. We believe smart technology should be simple and accessible to everyone, from freelancers to Fortune 500 companies.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutUs;
