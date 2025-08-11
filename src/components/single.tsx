import { VerifiedIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { classificationService } from "../config/apiService";
import { useNavigate } from "react-router-dom";

const SingleProcess = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Aucun fichier sélectionné");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await classificationService.classifySingleCV(formData);

      if (response.data) {
        setUploaded(true);
        addToast({
          title: "Importation réussie",
          description: "Profil ajouté avec succès",
          color: "success",
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      setError(
        error.response?.data?.message || "Erreur lors du traitement du fichier"
      );
      addToast({
        title: "Erreur",
        description: "Échec de l'importation du profil",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const input = document.createElement("input");
      input.accept = ".pdf";
      input.multiple = false;
      input.type = "file";
      input.style.display = "none";

      input.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files?.length) {
          const file = target.files[0];

          // Validation du fichier
          if (file.type !== "application/pdf") {
            setError("Veuillez sélectionner un fichier PDF");
            setLoading(false);
            return;
          }

          // Vérification de la taille (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            setError("Le fichier est trop volumineux (max 10MB)");
            setLoading(false);
            return;
          }

          setSelectedFile(file);
        }
        setLoading(false);
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier :", error);
      setError("Erreur lors de la sélection du fichier");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploaded(false);
    setError(null);
    setLoading(false);
  };

  if (uploaded) {
    return (
      <section className="h-[70%] flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title({ color: "green" })}>
            ✓ Traitement terminé
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Le profil a été extrait et ajouté avec succès
          </div>
          <div className="flex flex-row gap-8 mt-10 justify-center">
            <Button radius="lg" color="secondary" size="lg" onPress={resetForm}>
              Importer un nouveau profil
            </Button>
            <Button
              radius="lg"
              color="success"
              size="lg"
              onPress={() => navigate("/profile")}
            >
              Parcourir les profils
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-[70%] flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <span className={title()}>Importez le&nbsp;</span>
        <span className={title({ color: "yellow" })}>CV&nbsp;</span>
        <br />
        <span className={title()}>pour extraire le profil </span>
        <div className={subtitle({ class: "mt-4" })}>Traitement par AI</div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-danger-600 text-center">{error}</p>
        </div>
      )}

      <div className="mt-8">
        <Button
          className="p-8"
          color={selectedFile !== null ? "primary" : "warning"}
          isLoading={loading}
          onPress={() => {
            if (selectedFile) {
              handleUpload();
            } else {
              handleClick();
            }
          }}
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
          startContent={selectedFile !== null ? <VerifiedIcon /> : null}
          variant="shadow"
          isDisabled={loading}
        >
          {loading ? (
            "Traitement en cours..."
          ) : selectedFile === null ? (
            "Téléverser un fichier PDF"
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-sm">{selectedFile.name}</span>
              <span className="font-bold text-lg">Appuyer pour confirmer</span>
            </div>
          )}
        </Button>
      </div>

      {selectedFile && !loading && (
        <div className="mt-4">
          <Button
            color="default"
            variant="light"
            size="sm"
            onPress={() => {
              setSelectedFile(null);
              setError(null);
            }}
          >
            Annuler la sélection
          </Button>
        </div>
      )}
    </section>
  );
};

export default SingleProcess;
