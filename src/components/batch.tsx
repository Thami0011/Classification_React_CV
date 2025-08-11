import axios from "axios";
import { useState } from "react";
import { subtitle, title } from "./primitives";
import { Button } from "@heroui/button";

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
    <section className=" h-[70%] flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <span className={title()}>Importation de&nbsp;</span>
        <span className={title({ color: "cyan" })}>CV&nbsp;</span>
        <br />
        <span className={title()}>par lot.</span>
        <div className={subtitle({ class: "mt-4" })}>Traitement par AI</div>
      </div>

      <div className="mt-8">
        <Button
          className="p-8"
          color={selectedFiles ? "success" : "warning"}
          onPress={selectedFiles ? handleUpload : handleClick}
          size="lg"
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
          variant="shadow"
        >
          {selectedFiles
            ? selectedFiles.length + " fichiers chargés"
            : "Téléverser les fichiers PDF."}
        </Button>
      </div>
    </section>
  );
};

export default BatchProcess;
