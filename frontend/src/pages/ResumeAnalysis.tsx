import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";

interface LearningResource {
  title: string;
  description: string;
  url: string;
}

interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestedSkills: string[];
  jobFitSummary: string;
  learningResources: LearningResource[];
}

const defaultAnalysis: ResumeAnalysis = {
  strengths: [],
  weaknesses: [],
  suggestedSkills: [],
  jobFitSummary: "",
  learningResources: [],
};

const ResumeDetails = () => {
  const location = useLocation();
  const [analysis, setAnalysis] = useState<ResumeAnalysis>(defaultAnalysis);
  const navigate = useNavigate();


  useEffect(() => {
    const stateAnalysis = location.state?.analysis;
    const stored = localStorage.getItem("resumeAnalysis");

    if (stateAnalysis) {
      setAnalysis(stateAnalysis);
      localStorage.setItem("resumeAnalysis", JSON.stringify(stateAnalysis));
    } else if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnalysis(parsed);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, [location.state]);

  const renderList = (title: string, items?: string[]) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );

  const renderResources = () => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-3">
        Learning Resources
      </h3>
      {analysis.learningResources.length > 0 ? (
        <ul className="space-y-4">
          {analysis.learningResources.map((res, idx) => (
            <li key={idx} className="bg-gray-800 p-4 rounded-xl shadow-sm">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 font-semibold hover:underline"
              >
                {res.title}
              </a>
              <p className="text-sm text-gray-400 mt-1">{res.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No learning resources available</p>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-black text-white px-4 py-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Resume Analysis Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {renderList("Strengths", analysis.strengths)}
              {renderList("Weaknesses", analysis.weaknesses)}
              {renderList("Suggested Skills", analysis.suggestedSkills)}
              {renderResources()}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3">Job Fit Summary</h3>
            <p className="text-gray-300 leading-relaxed">
              {analysis.jobFitSummary || "No summary available."}
            </p>
          </div>

          <div className="mt-10 text-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded-lg"
            >
              Back To HOME
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;