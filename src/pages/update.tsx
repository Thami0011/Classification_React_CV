import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/react";
import { profileService } from "../config/apiService";
import { Profile } from "./profile";
import { form } from "@heroui/theme";

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface FormData {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  description: string;
  summary: string;
  ville: string;
  "poste visé": string;
  experiences: Experience[];
  competences_techniques: string[];
  education: Education[];
  formations: string[];
  certifications: string[];
  langues: string[];
}

const UpdateProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const profileId = state?.profileId;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: profileId,
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    description: "",
    summary: "",
    ville: "",
    "poste visé": "",
    experiences: [],
    competences_techniques: [],
    education: [],
    formations: [],
    certifications: [],
    langues: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // États pour les nouveaux éléments
  const [newSkill, setNewSkill] = useState("");
  const [newLangue, setNewLangue] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newFormation, setNewFormation] = useState("");

  useEffect(() => {
    if (!profileId) {
      setError("ID du profil non disponible");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await profileService.getProfileById(profileId);
        const profileData = response.data;
        setProfile(profileData);

        // Normaliser les données d'éducation
        let normalizedEducation = [];
        if (profileData.education && Array.isArray(profileData.education)) {
          normalizedEducation = profileData.education.map((edu: any) => {
            if (typeof edu === "object" && edu !== null) {
              return {
                degree: edu.degree || edu.school || "",
                institution: edu.institution || edu.school || "",
                year: edu.year || "",
                description: edu.description || "",
              };
            }
            return {
              degree: "",
              institution: "",
              year: "",
              description: "",
            };
          });
        }

        // Initialiser le formulaire avec les données existantes
        setFormData({
          id: profileId,
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          location: profileData.location || profileData.ville || "",
          title: profileData.title || "",
          description: profileData.description || "",
          summary: profileData.summary || "",
          ville: profileData.ville || "",
          "poste visé": profileData["poste visé"] || "",
          experiences: Array.isArray(profileData.experiences)
            ? profileData.experiences.map((exp: any) => ({
                title: exp.title || "",
                company: exp.company || "",
                duration: exp.duration || exp.dateRange || "",
                description: exp.description || "",
              }))
            : [],
          competences_techniques: Array.isArray(
            profileData.competences_techniques
          )
            ? profileData.competences_techniques
            : [],
          education: normalizedEducation,
          formations: Array.isArray(profileData.formations)
            ? profileData.formations
            : [],
          certifications: Array.isArray(profileData.certifications)
            ? profileData.certifications
            : [],
          langues: Array.isArray(profileData.langues)
            ? profileData.langues
            : [],
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    console.log(profile);
  }, [profileId]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      experiences: updatedExperiences,
    }));
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", year: "", description: "" },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (
      newSkill.trim() &&
      !formData.competences_techniques.includes(newSkill.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        competences_techniques: [
          ...prev.competences_techniques,
          newSkill.trim(),
        ],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      competences_techniques: prev.competences_techniques.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const addLangue = () => {
    if (newLangue.trim() && !formData.langues.includes(newLangue.trim())) {
      setFormData((prev) => ({
        ...prev,
        langues: [...prev.langues, newLangue.trim()],
      }));
      setNewLangue("");
    }
  };

  const removeLangue = (langueToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      langues: prev.langues.filter((langue) => langue !== langueToRemove),
    }));
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (certificationToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (cert) => cert !== certificationToRemove
      ),
    }));
  };

  const addFormation = () => {
    if (
      newFormation.trim() &&
      !formData.formations.includes(newFormation.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        formations: [...prev.formations, newFormation.trim()],
      }));
      setNewFormation("");
    }
  };

  const removeFormation = (formationToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      formations: prev.formations.filter(
        (formation) => formation !== formationToRemove
      ),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await profileService.updateProfile(formData);

      addToast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
        color: "success",
      });

      // Rediriger vers la page de détail du profil
      navigate(`/profileDetail`, { state: { profileId } });
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.response?.data?.message || "Erreur lors de la sauvegarde");
      addToast({
        title: "Erreur",
        description: "Échec de la mise à jour du profil",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Chargement du profil..." />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <h2 className="text-xl font-bold text-danger mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button color="primary" onPress={handleGoBack}>
              Retour
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête */}
      <div className="mb-6">
        <Button
          color="default"
          variant="bordered"
          onPress={handleGoBack}
          className="mb-4"
        >
          ← Retour
        </Button>
        <h1 className="text-3xl font-bold">Modifier le Profil</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-danger-600">{error}</p>
        </div>
      )}

      {/* Informations générales */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Informations générales</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              variant="bordered"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              variant="bordered"
            />
            <Input
              label="Téléphone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              variant="bordered"
            />
            <Input
              label="Localisation"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              variant="bordered"
            />
            <Input
              label="Titre du profil"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              variant="bordered"
            />
            <Input
              label="Poste visé"
              value={formData["poste visé"]}
              onChange={(e) => handleInputChange("poste visé", e.target.value)}
              variant="bordered"
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              variant="bordered"
              minRows={3}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Résumé"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              variant="bordered"
              minRows={4}
            />
          </div>
        </CardBody>
      </Card>

      {/* Expériences professionnelles */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            Expériences professionnelles
          </h2>
          <Button color="primary" size="sm" onPress={addExperience}>
            + Ajouter une expérience
          </Button>
        </CardHeader>
        <CardBody>
          {formData.experiences.map((experience, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Expérience {index + 1}</h3>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => removeExperience(index)}
                >
                  Supprimer
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Titre du poste"
                  value={experience.title || ""}
                  onChange={(e) =>
                    handleExperienceChange(index, "title", e.target.value)
                  }
                  variant="bordered"
                />
                <Input
                  label="Entreprise"
                  value={experience.company || ""}
                  onChange={(e) =>
                    handleExperienceChange(index, "company", e.target.value)
                  }
                  variant="bordered"
                />
                <Input
                  label="Durée"
                  value={experience.duration || ""}
                  onChange={(e) =>
                    handleExperienceChange(index, "duration", e.target.value)
                  }
                  variant="bordered"
                  placeholder="Ex: Jan 2020 - Déc 2022"
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Description"
                  value={experience.description || ""}
                  onChange={(e) =>
                    handleExperienceChange(index, "description", e.target.value)
                  }
                  variant="bordered"
                  minRows={3}
                />
              </div>
            </div>
          ))}
          {formData?.experiences.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune expérience ajoutée
            </p>
          )}
        </CardBody>
      </Card>

      {/* Formation */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Formation</h2>
          <Button color="primary" size="sm" onPress={addEducation}>
            + Ajouter une formation
          </Button>
        </CardHeader>
        <CardBody>
          {Object.values(formData.education).map((edu, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Formation {index + 1}</h3>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => removeEducation(index)}
                >
                  Supprimer
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Diplôme"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  variant="bordered"
                />
                <Input
                  label="Institution"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "institution", e.target.value)
                  }
                  variant="bordered"
                />
                <Input
                  label="Année"
                  value={edu.year || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "year", e.target.value)
                  }
                  variant="bordered"
                  placeholder="Ex: 2020"
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Description"
                  value={edu.description || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "description", e.target.value)
                  }
                  variant="bordered"
                  minRows={2}
                />
              </div>
            </div>
          ))}
          {formData.formations.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune formation ajoutée
            </p>
          )}
        </CardBody>
      </Card>

      {/* Compétences */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Compétences</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Ajouter une compétence"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              variant="bordered"
              className="flex-1"
            />
            <Button color="primary" onPress={addSkill}>
              Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(formData.competences_techniques).map(
              (skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                    onClick={() => removeSkill(skill)}
                  >
                    &times;
                  </button>
                </div>
              )
            )}
          </div>
          {formData?.competences_techniques.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune compétence ajoutée
            </p>
          )}
        </CardBody>
      </Card>

      {/* Langues */}
      {/* <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Langues</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Ajouter une langue"
              value={newLangue}
              onChange={(e) => setNewLangue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addLangue()}
              variant="bordered"
              className="flex-1"
            />
            <Button color="primary" onPress={addLangue}>
              Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.langues.map((langue, index) => (
              <div
                key={index}
                className="flex items-center bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {langue}
                <button
                  type="button"
                  className="ml-2 text-purple-600 hover:text-purple-900 focus:outline-none"
                  onClick={() => removeLangue(langue)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {formData.langues.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune langue ajoutée
            </p>
          )}
        </CardBody>
      </Card> */}

      {/* Certifications */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Certifications</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Ajouter une certification"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCertification()}
              variant="bordered"
              className="flex-1"
            />
            <Button color="primary" onPress={addCertification}>
              Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((certification, index) => (
              <div
                key={index}
                className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {certification}
                <button
                  type="button"
                  className="ml-2 text-green-600 hover:text-green-900 focus:outline-none"
                  onClick={() => removeCertification(certification)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {formData.certifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune certification ajoutée
            </p>
          )}
        </CardBody>
      </Card>

      {/* Formations supplémentaires */}
      {/* <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Formations supplémentaires</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Ajouter une formation"
              value={newFormation}
              onChange={(e) => setNewFormation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFormation()}
              variant="bordered"
              className="flex-1"
            />
            <Button color="primary" onPress={addFormation}>
              Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.formations.map((formation, index) => (
              <div
                key={index}
                className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {formation}
                <button
                  type="button"
                  className="ml-2 text-yellow-600 hover:text-yellow-900 focus:outline-none"
                  onClick={() => removeFormation(formation)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {formData.formations.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune formation supplémentaire ajoutée
            </p>
          )}
        </CardBody>
      </Card> */}

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          color="default"
          variant="bordered"
          onPress={handleGoBack}
          isDisabled={saving}
        >
          Annuler
        </Button>
        <Button
          color="primary"
          onPress={handleSave}
          isLoading={saving}
          size="lg"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateProfile;
