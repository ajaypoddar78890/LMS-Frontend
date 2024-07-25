import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import pipwerks from "pipwerks-scorm-api-wrapper";

const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    // Fetch course data and set the file URL
    axios
      .get("http://localhost:5500/api/courses")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const course = response.data[0];
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

  useEffect(() => {
    const handleLoad = () => {
      console.log("IFrame loaded, attempting to find SCORM API...");

      pipwerks.SCORM.version = "1.2"; // or "2004"

      const initialized = pipwerks.SCORM.init();

      if (initialized) {
        console.log("SCORM initialized successfully");

        const setStatus = pipwerks.SCORM.set(
          "cmi.core.lesson_status",
          "completed"
        );
        if (!setStatus) {
          console.error(
            "Failed to set SCORM value",
            pipwerks.SCORM.debug.getCode(),
            pipwerks.SCORM.debug.getInfo()
          );
        }

        const lessonStatus = pipwerks.SCORM.get("cmi.core.lesson_status");
        console.log("Lesson status:", lessonStatus);
      } else {
        console.error(
          "SCORM initialization failed",
          pipwerks.SCORM.debug.getCode(),
          pipwerks.SCORM.debug.getInfo()
        );
      }

      return () => {
        pipwerks.SCORM.quit();
      };
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", handleLoad);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, [fileUrl]);

  return (
    <div>
      <h1>Here is the iframe for playing the SCORM content</h1>
      {fileUrl ? (
        <iframe
          ref={iframeRef}
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
