import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";

type SkillCategory = "languages" | "software" | "communication" | "backend" | "frontend";

interface ResumeResponse {
  extracted?: Record<SkillCategory, string[]> | null;
  feedback?: Record<
    SkillCategory,
    {
      matched: string[];
      missing: string[];
      suggestion: string;
    }
  > | null;
}

const categoryLabels: Record<SkillCategory, string> = {
  languages: "Languages",
  software: "Software & Tools",
  communication: "Communication Skills",
  backend: "Backend Skills",
  frontend: "Frontend Skills"
};

const ResumeAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<ResumeResponse | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stateData = location.state;
    console.log("location.state:", stateData);

    if (stateData && (stateData.skills || stateData.feedback)) {
      setData({
        extracted: stateData.skills || null,
        feedback: stateData.feedback || null,
      });
      console.log("Set data from location.state");
    } else {
      const storedSkills = localStorage.getItem("skills");
      const storedFeedback = localStorage.getItem("feedback");
      console.log("storedSkills:", storedSkills);
      console.log("storedFeedback:", storedFeedback);

      try {
        setData({
          extracted: storedSkills ? JSON.parse(storedSkills) : null,
          feedback: storedFeedback ? JSON.parse(storedFeedback) : null,
        });
        console.log("Set data from localStorage");
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    }
  }, [location]);

  if (!data?.extracted && !data?.feedback) {
    return <p className="text-center mt-10 text-gray-500">No resume data found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        <div ref={pdfRef} className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-2 pb-6 border-b border-gray-200">
            <img src={logo} alt="SmartScan Logo" className="h-16 object-contain" />
            <h1 className="text-2xl font-bold text-gray-800">SmartScan Resume Analysis</h1>
            <p className="text-sm text-gray-500">Personalized skill extraction and feedback</p>
          </div>

          {/* Render feedback if available */}
          {data.feedback && Object.entries(data.feedback).map(([key, value]) => {
            const category = key as SkillCategory;

            return (
              <div
                key={`feedback-${category}`}
                className="bg-white rounded-2xl shadow p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {categoryLabels[category]}
                </h2>

                <div className="flex flex-wrap gap-2 mb-3">
                  {value.matched.map((skill) => (
                    <Badge
                      key={`matched-${skill}`}
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {value.missing.map((skill) => (
                    <Badge
                      key={`missing-${skill}`}
                      variant="outline"
                      className="bg-red-100 text-red-700 border-red-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-gray-600 italic">{value.suggestion}</p>
              </div>
            );
          })}

          {/* Render skills if available */}
          {data.extracted && Object.entries(data.extracted).map(([key, skills]) => {
            const category = key as SkillCategory;

            return (
              <div
                key={`skills-${category}`}
                className="bg-white rounded-2xl shadow p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {categoryLabels[category]} - Extracted Skills
                </h2>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={`skill-${skill}`}
                      variant="default"
                      className="bg-blue-100 text-blue-700 border-blue-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
  );
};

export default ResumeAnalysisPage;
