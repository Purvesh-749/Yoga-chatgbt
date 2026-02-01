import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const PoseDetection = () => {
  // 👉 User selected pose (THIS WAS MISSING)
  const [selectedPose, setSelectedPose] = useState("any");

  // 👉 Data coming from Python
  const [poseData, setPoseData] = useState({
    pose: "unknown",
    confidence: 0,
    hold_time: 0,
    best_time: 0,
    correct: false,
  });

  // 🔁 Fetch live status from Python
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/status")
        .then((res) => res.json())
        .then((data) => setPoseData(data))
        .catch(() => {});
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // 🔁 SEND SELECTED POSE TO PYTHON (IMPORTANT)
  useEffect(() => {
    fetch("http://127.0.0.1:5000/set_pose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pose: selectedPose }),
    }).catch(() => {});
  }, [selectedPose]);

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/yoga">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Yoga
            </Button>
          </Link>

          <Badge className="bg-green-600 text-white">
            Python Pose Detection (Live)
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* VIDEO STREAM */}
          <div className="lg:col-span-2">
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Webcam Pose Detection</span>

                  {/* 🔽 POSE SELECT DROPDOWN */}
                  <select
                    value={selectedPose}
                    onChange={(e) => setSelectedPose(e.target.value)}
                    className="px-3 py-2 rounded border text-sm"
                  >
                    <option value="any">Any Pose</option>
                    <option value="mountain">Mountain</option>
                    <option value="chair">Chair</option>
                    <option value="tree">Tree</option>
                    <option value="cobra">Cobra</option>
                    <option value="warrior">Warrior</option>
                  </select>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <img
                    src="http://127.0.0.1:5000/video_feed"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LIVE STATS */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Live Stats</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Confidence
                    </div>
                    <div className="text-2xl font-bold">
                      {poseData.confidence}%
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Hold Time
                    </div>
                    <div className="text-2xl font-bold">
                      {poseData.hold_time}s
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Detected Pose: <b>{poseData.pose}</b>
                </div>

                <div className="text-center text-sm">
                  {poseData.correct ? (
                    <span className="text-green-600 font-semibold">
                      ✅ Correct Pose
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      ❌ Incorrect Pose
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Session
                </Button>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground text-center">
              Tip: Step back so your full body is visible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseDetection;
