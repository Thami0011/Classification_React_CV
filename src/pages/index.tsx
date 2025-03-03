import { VerifiedIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { useState } from "react";
import axios from "axios";

export default function IndexPage() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile!);

      const options = {
        method: "POST",
        url: "http://localhost:8085/api/ocr2",
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

  const handleClick = async () => {
    setLoading(true);

    try {
      const input = document.createElement("input");
      input.accept = ".pdf";
      input.multiple = false;
      input.type = "file";
      input.style.display = "none";

      input.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files?.length) {
          setSelectedFile(target.files[0]);
        }
        setLoading(false); // Move this inside the event listener
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier :", error);
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className=" h-[70%] flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Importez le&nbsp;</span>
          <span className={title({ color: "yellow" })}>CV&nbsp;</span>
          <br />
          <span className={title()}>pour extraire le profil </span>
          <div className={subtitle({ class: "mt-4" })}>Traitement par AI</div>
        </div>

        <div className="mt-8">
          <Button
            className="p-8"
            color={selectedFile !== null ? "danger" : "warning"}
            isLoading={loading}
            onPress={() => {
              if (selectedFile) {
                handleUpload();
              } else {
                handleClick();
              }
            }}
            size="lg"
            startContent={selectedFile !== null ? <VerifiedIcon /> : null}
            variant="shadow"
          >
            {loading ? (
              "Téléversement..."
            ) : selectedFile === null ? (
              "Téléverser un fichier PDF"
            ) : (
              <>
                {selectedFile.name}
                <span className="font-bold text-lg">
                  Appuyer pour confirmer
                </span>
              </>
            )}
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
