import { useEffect, useState, useRef } from "react";


const YogaCamera = () => {
  const [pose, setPose] = useState("Detecting...");
  const [confidence, setConfidence] = useState(0);


  // Fetch real pose data from Flask
  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_pose: "mountain" // later make this dynamic
        })
      });

      const data = await res.json();
      setPose(data.pose);
      setConfidence(data.confidence);
    } catch (err) {
      console.error(err);
    }
  }, 800);

  return () => clearInterval(interval);
}, []);



  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Live Yoga Pose Detection</h1>

      <div className="rounded-xl overflow-hidden border-4 border-green-500">
          <img
          src="http://127.0.0.1:5000/video_feed"
          className="rounded-xl border-4 border-green-500"
          width={640}
          height={480}
          alt="Python Pose Detection"
        />


      </div>

      <div className="mt-6 text-center">
        <p className="text-xl">
          Pose: <span className="font-bold text-green-400">{pose}</span>
        </p>
        <p className="text-lg">
          Confidence: {confidence.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default YogaCamera;
