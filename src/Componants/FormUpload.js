import React from "react";

const FormUpload = () => {
  return (
    <div className="flex justify-center items-center bg-black h-screen w-full">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        action="/upload"
        method="post"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload the Scrom / Xapi file
        </h2>

        <div className="mb-4">
          <label htmlFor="fileInput" className="block text-gray-700 mb-2">
            Select File:
          </label>
          <input
            id="fileInput"
            type="file"
            name="file"
            className="w-full p-2 border border-gray-300 rounded-md"
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
