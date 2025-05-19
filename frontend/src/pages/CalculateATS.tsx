import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/shared/Navbar";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

interface ServerResponse {
  success: boolean;
  message: string;
  matchedKeywords: string[];
  score: number;
  missingKeywords: string[];
};

const CalculateATS = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jobDescription) {
      return toast("Please provide both resume and job description.", {
        icon: <XCircle className="text-red-600 w-5 h-5" />
      });
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    setLoading(true);

    try {
      const response = await axios.post<ServerResponse>('https://smartscan-production.up.railway.app/api/v1/resume/calculate-ats', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }, 
        withCredentials: true
      });

      console.log(response);

      setScore(response.data.score);
      setMatched(response.data.matchedKeywords);
      setMissing(response.data.missingKeywords);
      toast.success(response.data.message || "ATS Score Fetched Successfully",{
          icon: <CheckCircle className="text-green-600 w-5 h-5" />
        });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Some error occurred";
      toast.error(message, {
        icon: <XCircle className="text-red-600 w-5 h-5" />
      });
    } finally {
      setLoading(false);
      setJobDescription('');
    }
  };

  return (
    <div>
      <Navbar />
      <Card className="max-w-2xl mx-auto mt-10 p-4">
        <CardHeader>
          <h2 className="text-xl font-bold">ATS Resume Matcher</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="resume">Upload Resume (PDF)</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label htmlFor="job">Paste Job Description</Label>
              <Textarea
                id="job"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter job description here..."
                rows={6}
              />
            </div>

            <Button type="submit" disabled={loading} className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Calculating..." : "Get ATS Score"}
            </Button>
          </form>

          {score !== null && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">ATS Score: {score}%</h3>
              <Progress value={score} indicatorClassName={`bg-gradient-to-r ${
                score >= 75
                  ? "from-green-400 to-green-600"
                  : score >= 50
                  ? "from-yellow-400 to-yellow-600"
                  : "from-red-400 to-red-600"
              }`} />
              <Separator className="my-4" />

              { matched.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">✅ Matched Keywords</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-green-600">
                    {matched.map((word, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 rounded">
                        {word}
                      </span>
                    ))}
                </div>
              </div>
              )}

              { missing.length > 0 && (
                <div>
                  <h4 className="font-semibold mt-4 mb-1">❌ Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-red-600">
                    {missing.map((word, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 rounded">
                        {word}
                      </span>
                    ))}
                </div>
              </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculateATS;