import React, { useEffect, useState } from "react";
import axios from "axios";

const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // Fetch course data from backend
    axios
      .get("http://localhost:5500/api/courses")
      .then((response) => {
        console.log("Response from backend:", response.data); // Debug log
        if (response.data && response.data.length > 0) {
          const course = response.data[0];
          console.log("Course data:", course); // Debug log
          if (course.videoUrl) {
            setFileUrl(`http://localhost:5500${course.videoUrl}`);
          } else {
            console.error("videoUrl is not defined in the course data");
          }
        } else {
          console.error("No courses found in the response");
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  return (
    <div>
      <h1>Here is the iframe for playing the video</h1>
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
