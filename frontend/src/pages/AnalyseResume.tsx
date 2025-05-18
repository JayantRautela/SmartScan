import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UploadResume from "@/components/UploadResume";

const AnalyseResume = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full h-screen bg-black">
      <Navbar />
      <div className="flex items-center justify-center flex-col h-screen">
        <section className="text-white max-w-2xl mx-auto mb-6 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            Analyze Your Resume
          </h1>
          <p className="text-sm sm:text-md">
            Ready to take your career to the next level?
          </p>
        </section>

        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-64 bg-white rounded-xl mx-auto mt-8 flex flex-col items-center justify-center px-4 py-6 shadow-lg">
          <Button
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer w-fit"
            onClick={() => setOpen(true)}
          >
            Upload Resume
          </Button>
          <UploadResume open={open} onOpenChange={setOpen} />
          <p className="mt-6 text-sm text-center">
            or drop a PDF,
            <br />
            <span className="text-gray-600">paste image or URL</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyseResume;
