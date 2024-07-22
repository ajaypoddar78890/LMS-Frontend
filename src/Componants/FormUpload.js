import React, { useState } from "react";
import axios from "axios";

const FormUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Ensure this name matches what the backend expects
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:5500/api/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("File uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="flex justify-center items-center bg-black h-screen w-full">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload the SCORM / xAPI file
        </h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description:
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fileInput" className="block text-gray-700 mb-2">
            Select File:
          </label>
          <input
            id="fileInput"
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormUpload;
