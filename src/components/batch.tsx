import axios from "axios";
import { useState } from "react";

const BatchProcess = () => {
  const [selectedFiles, setSelectedFile] = useState<File[] | null>(null);
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
  return <div>batch process</div>;
};

export default BatchProcess;
