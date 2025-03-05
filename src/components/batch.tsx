import axios from "axios";
import { useState } from "react";

const BatchProcess = () => {
  const [selectedFiles, setSelectedFile] = useState<File[] | null>(null);

  const handleClick = () => {
    const input = document.createElement("input");
    input.accept = ".pdf";
    input.multiple = true;
    input.type = "file";
    input.style.display = "none";
    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.length) {
        setSelectedFile(Array.from(target.files));
      }
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles!.map((selectedFile) => {
        formData.append("file", selectedFile);
      });

      const options = {
        method: "POST",
        url: "http://localhost:8085/api/ocrbatch",
        headers: {
          "Content-Type": "multipart/form-data;",
        },
        data: formData,
      };

      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <button onClick={selectedFiles ? handleUpload : handleClick}>
        Upload
      </button>
      {selectedFiles && <div>files : {selectedFiles?.length}</div>}
    </>
  );
};

export default BatchProcess;
