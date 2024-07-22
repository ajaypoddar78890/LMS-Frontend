// src/components/FileViewer.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // Fetch course data from backend
    axios
      .get("http://localhost:5500/api/courses")
      .then((response) => {
        // Assume we get the first course for demonstration
        const course = response.data[0];
        setFileUrl(`http://localhost:5500${course.videoUrl}`);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  return (
    <div>
      <h1>here is the iframe for playing the video </h1>
      {fileUrl ? (
        <iframe
          src={fileUrl}
          width="600"
          height="400"
          title="SCORM Content"
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FileViewer;
