// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const FileViewer = () => {
//   const [fileUrl, setFileUrl] = useState("");

//   useEffect(() => {
//     // Fetch course data from backend
//     axios
//       .get("http://localhost:5500/api/courses")
//       .then((response) => {
//         console.log("Response from backend:", response.data); // Debug log
//         if (response.data && response.data.length > 0) {
//           const course = response.data[0];
//           console.log("Course data:", course); // Debug log
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

//   return (
//     <div>
//       <h1>Here is the iframe for playing the video</h1>
//       {fileUrl ? (
//         <iframe
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




import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    // Fetch course data from backend
    axios
      .get('http://localhost:5500/api/courses')
      .then((response) => {
        console.log('Response from backend:', response.data); // Debug log
        if (response.data && response.data.length > 0) {
          const course = response.data[0];
          console.log('Course data:', course); // Debug log
          if (course.videoUrl) {
            setFileUrl(`http://localhost:5500${course.videoUrl}`);
          } else {
            console.error('videoUrl is not defined in the course data');
          }
        } else {
          console.error('No courses found in the response');
        }
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      const iframeWindow = iframeRef.current.contentWindow;

      if (iframeWindow) {
        // Load SCORM API wrapper script in the iframe
        const script = document.createElement('script');
        script.src = '/js/scorm-api-wrapper.js'; // Adjust the path if needed
        iframeWindow.document.body.appendChild(script);

        script.onload = () => {
          // Initialize SCORM API in the iframe
          const scorm = iframeWindow.pipwerks.SCORM;
          scorm.version = '1.2'; // or '2004'

          if (scorm.init()) {
            console.log('SCORM initialized');
            
            // Fetch SCORM data
            const lessonStatus = scorm.get('cmi.core.lesson_status');
            console.log('Lesson status:', lessonStatus);
            // Update state or perform other actions as needed
          } else {
            console.error('SCORM initialization failed');
          }
        };
      }
    };

    // Check if the iframe is loaded
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleLoad);
    }

    return () => {
      // Cleanup event listener
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, [fileUrl]);

  return (
    <div>
      <h1>Here is the iframe for playing the video</h1>
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
