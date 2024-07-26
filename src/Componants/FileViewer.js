import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

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
    // Function to load the SCORM API script
    const loadScormScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/scorm-api-wrapper.js";
        script.onload = () => {
          console.log("SCORM API script loaded");
          console.log("SCORM object on window:", window.SCORM); // Debugging line
          resolve();
        };
        script.onerror = (error) => {
          console.error("Error loading SCORM API script:", error);
          reject(error);
        };
        document.body.appendChild(script);
      });
    };

    const initializeScorm = async () => {
      try {
        await loadScormScript();

        // Ensure SCORM functions are available
        if (window.SCORM) {
          const { initialize, terminate, setValue, getValue, commit } =
            window.SCORM;

          if (initialize()) {
            console.log("SCORM initialized successfully");
            setValue("cmi.core.lesson_status", "incomplete");
            commit();
            const lessonStatus = getValue("cmi.core.lesson_status");
            console.log("Lesson Status:", lessonStatus);
          } else {
            console.error("Failed to initialize SCORM");
          }

          // Terminate SCORM on component unmount
          return () => {
            terminate();
          };
        } else {
          console.error("SCORM API not found on window");
        }
      } catch (error) {
        console.error("Error initializing SCORM:", error);
      }
    };

    initializeScorm();

    // Clean up
    return () => {
      if (window.SCORM) {
        const { terminate } = window.SCORM;
        terminate();
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
