"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [imageKey, setImageKey] = useState<string>("");
  const [labels, setLabels] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [article, setArticle] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setLabels(null); // Reset previous labels
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.key) {
      setImageKey(data.key);
      setUploadStatus("Upload successful. Processing image labels...");
      setPolling(true);
    } else {
      setUploadStatus("Error uploading file.");
    }
  };

  const generateArticle = async (rekognitionData: any) => {
    const res = await fetch("/api/generate-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rekognitionData),
    });

    const data = await res.json();
    if (data.article) {
      console.log("Generated Article:", data.article);
      setArticle(data.article);
    } else {
      console.error("Error:", data.error);
    }
  };

  // Polling mechanism: check every 5 seconds for the result
  useEffect(() => {
    if (!polling || !imageKey) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/get-labels?key=${encodeURIComponent(imageKey)}`
      );
      const data = await res.json();

      // If labels exist (i.e. the Rekognition result is available)
      if (data && data.labels) {
        setLabels(data.labels);
        setUploadStatus("Labels processed!");
        setPolling(false);
        generateArticle(data.labels);
        clearInterval(interval);
      }
    }, 5000); // 5000 ms = 5 seconds

    return () => clearInterval(interval);
  }, [polling, imageKey]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload an Image</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload
        </button>
      </form>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}

      {imageKey && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Uploaded Image:</h2>
          <img
            src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${imageKey}`}
            alt="Uploaded File"
            className="mt-2 max-w-xs rounded-lg border"
          />
        </div>
      )}

      {article && (
        <div className="mt-4 p-2 border rounded">
          <h2 className="font-semibold mb-2 font-">Article:</h2>
          <p>{article}</p>
        </div>
      )}
    </div>
  );
}
