import { motion } from "framer-motion";
import { CheckCircle, UploadCloud, WandSparkles } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "1. Upload Resume",
    description: "Upload your current resume in PDF format securely.",
  },
  {
    icon: WandSparkles,
    title: "2. Analyze Instantly",
    description: "SmartScan uses NLP to analyze your resume for Skills matching and generating feedbacks.",
  },
  {
    icon: CheckCircle,
    title: "3. Get Fixes",
    description: "Receive a detailed report and personalized suggestions to improve.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorks = () => {
  return (
    <section className="w-full px-4 py-12 md:py-20 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground max-w-xl mx-auto mb-12 text-sm md:text-base"
        >
          SmartScan makes resume optimization effortless in just 3 simple steps.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center border"
            >
              <step.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
