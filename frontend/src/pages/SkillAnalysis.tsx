import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// @ts-expect-error: 'html2pdf.js' has no official TypeScript declarations
import html2pdf from "html2pdf.js";
import { Badge } from "@/components/ui/badge";
import logo from "../assets/logo.png";

type SkillCategory = "languages" | "software" | "communication" | "backend" | "frontend";

interface ResumeResponse {
  extracted: Record<SkillCategory, string[]>;
  feedback: Record<
    SkillCategory,
    {
      matched: string[];
      missing: string[];
      suggestion: string;
    }
  >;
}

const categoryLabels: Record<SkillCategory, string> = {
  languages: "Languages",
  software: "Software & Tools",
  communication: "Communication Skills",
  backend: "Backend Skills",
  frontend: "Frontend Skills"
};

const ResumeAnalysisPage: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<ResumeResponse | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stateData = location.state;
    if (stateData && stateData.skills && stateData.feedback) {
      setData({ extracted: stateData.skills, feedback: stateData.feedback });
    } else {
      const storedSkills = localStorage.getItem("skills");
      const storedFeedback = localStorage.getItem("feedback");
      if (storedSkills && storedFeedback) {
        setData({
          extracted: JSON.parse(storedSkills),
          feedback: JSON.parse(storedFeedback)
        });
      }
    }
  }, [location]);

  const handleExportPDF = () => {
    if (!pdfRef.current) return;
    html2pdf().set({
      margin: 0.5,
      filename: "resume_analysis_report.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    }).from(pdfRef.current).save();
  };

  if (!data) {
    return <p className="text-center mt-10 text-gray-500">No resume data found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">🧠 Resume Skill Analysis</h1>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Export as PDF
          </button>
        </div>

        <div ref={pdfRef} className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-2 pb-6 border-b border-gray-200">
                <img src={logo} alt="SmartScan Logo" className="h-16 object-contain" />
                <h1 className="text-2xl font-bold text-gray-800">SmartScan Resume Analysis</h1>
                <p className="text-sm text-gray-500">Personalized skill extraction and feedback</p>
            </div>
          {Object.entries(data.feedback).map(([key, value]) => {
            const category = key as SkillCategory;

            return (
              <div
                key={category}
                className="bg-white rounded-2xl shadow p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {categoryLabels[category]}
                </h2>

                <div className="flex flex-wrap gap-2 mb-3">
                  {value.matched.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {value.missing.map((skill) => (
                    <Badge
                      key={skill}
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
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
