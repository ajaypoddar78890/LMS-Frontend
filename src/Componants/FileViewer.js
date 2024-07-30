// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";

// const FileViewer = () => {
//   const [fileUrl, setFileUrl] = useState("");
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     // Fetch course data and set the file URL
//     axios
//       .get("http://localhost:5500/api/courses")
//       .then((response) => {
//         if (response.data && response.data.length > 0) {
//           const course = response.data[0];
//           if (course.videoUrl) {
//             setFileUrl(`http://localhost:5500${course.videoUrl}`);
//           } else {
//             console.error("videoUrl is not defined in the course data");
//           }
//         } else {
//           console.error("No courses found in the response");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching courses:", error);
//       });
//   }, []);

//   useEffect(() => {
//     // Function to load the SCORM API script
//     const loadScormScript = () => {
//       return new Promise((resolve, reject) => {
//         const script = document.createElement("script");
//         script.src = "http://localhost:5500/scorm-api-wrapper.js"; // Ensure this URL is correct
//         script.onload = () => {
//           console.log("SCORM API script loaded");
//           resolve();
//         };
//         script.onerror = (error) => {
//           console.error("Error loading SCORM API script:", error);
//           reject(error);
//         };
//         document.body.appendChild(script);
//       });
//     };

//     const initializeScorm = async () => {
//       try {
//         await loadScormScript();

//         // Check if the SCORM API is available
//         const scormAPI = window.SCORM;
//         if (scormAPI) {
//           const { initialize, terminate, setValue, getValue, commit } = scormAPI;

//           if (initialize()) {
//             console.log("SCORM initialized successfully");
//             setValue("cmi.core.lesson_status", "incomplete");
//             commit();

//             const lessonStatus = getValue("cmi.core.lesson_status");
//             console.log("Lesson Status:", lessonStatus);

//             window.addEventListener("message", (event) => {
//               if (event.data.type === "scorm") {
//                 axios
//                   .post(
//                     "http://localhost:5500/scorm-api/save-data",
//                     event.data.payload
//                   )
//                   .then((response) => {
//                     console.log("SCORM data saved:", response.data);
//                   })
//                   .catch((error) => {
//                     console.error("Error saving SCORM data:", error);
//                   });
//               }
//             });

//             return () => {
//               terminate();
//             };
//           } else {
//             console.error("Failed to initialize SCORM");
//           }
//         } else {
//           console.error("SCORM API not found on window");
//         }
//       } catch (error) {
//         console.error("Error initializing SCORM:", error);
//       }
//     };

//     if (fileUrl) {
//       initializeScorm();
//     }

//     return () => {
//       const scormAPI = window.SCORM;
//       if (scormAPI) {
//         scormAPI.terminate();
//       }
//     };
//   }, [fileUrl]);

//   return (
//     <div>
//       <h1>Here is the iframe for playing the SCORM content</h1>
//       {fileUrl ? (
//         <iframe
//           ref={iframeRef}
//           src={fileUrl}
//           width="600"
//           height="400"
//           title="SCORM Content"
//         ></iframe>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default FileViewer;
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState("");

  const iframeRef = useRef(null);

  // Fetch course data and set the file URL
  useEffect(() => {
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

  // Load SCORM API script and initialize SCORM
  useEffect(() => {
    const loadScormScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/scorm-api-wrapper.js"; // Correct path to your script
        script.onload = () => {
          console.log("SCORM API script loaded");
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

        if (window.SCORM) {
          const {
            LMSInitialize,
            LMSSetValue,
            LMSGetValue,
            LMSCommit,
            LMSFinish,
          } = window.SCORM;

          if (LMSInitialize("")) {
            console.log("SCORM initialized successfully");
            LMSSetValue("cmi.core.lesson_status", "incomplete");
            LMSCommit("");

            const lessonStatus = LMSGetValue("cmi.core.lesson_status");
            console.log("Lesson Status:", lessonStatus);

            const handleMessage = (event) => {
              if (event.data.type === "scorm") {
                console.log("Received SCORM data:", event.data.payload); // Debug: Log received SCORM data
                // Send SCORM data to the backend
                sendScormData(event.data.payload);
              }
            };

            window.addEventListener("message", handleMessage);

            // Cleanup on component unmount
            return () => {
              window.removeEventListener("message", handleMessage);
              if (window.SCORM) {
                LMSFinish("");
              }
            };
          } else {
            console.error("Failed to initialize SCORM");
          }
        } else {
          console.error("SCORM API not found on window");
        }
      } catch (error) {
        console.error("Error initializing SCORM:", error);
      }
    };

    if (fileUrl) {
      initializeScorm();
    }
  }, [fileUrl]);

  // Function to send SCORM data
  const sendScormData = async (data) => {
    try {
      if (
        !data ||
        typeof data.key === "undefined" ||
        typeof data.value === "undefined"
      ) {
        console.error("Invalid SCORM data:", data);
        return;
      }
      const response = await axios.post(
        "http://localhost:5500/scormapi/savedata",
        data
      );
      console.log("Sending SCORM data:", data); // Debug: Log SCORM data
      console.log("SCORM data saved:", response.data);
    } catch (error) {
      console.error("Error saving SCORM data:", error);
    }
  };

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
