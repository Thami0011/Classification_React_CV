import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { profileService } from "../config/apiService";
import { Profile } from "./profile";

const ProfileDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const profileId = state?.profileId;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setProfile(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    console.log("Profil ID:", profile);
  }, [profileId]);

  const handleEdit = () => {
    navigate("/update", { state: { profileId } });
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

  if (error) {
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

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <h2 className="text-xl font-bold mb-2">Profil non trouvé</h2>
            <p className="text-gray-600 mb-4">
              Le profil demandé n'existe pas.
            </p>
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
      {/* En-tête avec bouton retour */}
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <Button color="default" variant="bordered" onPress={handleGoBack}>
            ← Retour
          </Button>
          <Button color="secondary" variant="light" onPress={handleEdit}>
            Modifier profil
          </Button>
          <Button
            color="danger"
            variant="solid"
            onPress={() => {
              profileService.deleteProfile(profile.id);
              navigate(-1);
            }}
          >
            Supprimer le Profil
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Détails du Profil</h1>
      </div>

      {/* Informations principales */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Informations générales</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.title && (
              <div>
                <span className="font-medium text-gray-600">Nom:</span>
                <p className="text-lg">{profile.title}</p>
              </div>
            )}
            {profile.title && (
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-lg">{profile.email}</p>
              </div>
            )}
            {profile.description && (
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="text-lg">{profile.description}</p>
              </div>
            )}

            {profile.ville && (
              <div>
                <span className="font-medium text-gray-600">Localisation:</span>
                <p className="text-lg">{profile.ville}</p>
              </div>
            )}

            {profile.langues && (
              <div>
                <span className="font-medium text-gray-600">Localisation:</span>
                <p className="text-lg">
                  {Object.values(profile.langues).map(
                    (lang) => lang.name + " "
                  )}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Expériences professionnelles */}
      {profile.expériences && profile.expériences.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-2xl font-semibold">
              Expériences professionnelles
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {profile.expériences.map((experience, index) => (
                <div
                  key={`${experience.title}-${index}`}
                  className="border-l-4 border-primary pl-4"
                >
                  <h3 className="text-xl font-semibold">{experience.title}</h3>
                  {experience.company && (
                    <p className="text-lg text-gray-600">
                      {experience.company}
                    </p>
                  )}
                  {experience.dateRange && (
                    <p className="text-sm text-gray-500">
                      {experience.dateRange}
                    </p>
                  )}
                  {experience.description && (
                    <p className="mt-2 text-gray-700">
                      {experience.description}
                    </p>
                  )}
                  {index < profile.expériences.length - 1 && (
                    <Divider className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Compétences */}
      {profile.competences_techniques && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Compétences</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {Object.values(profile.competences_techniques).map(
                (skill, index) => (
                  <div key={`${skill}-${index}`} className="mb-2">
                    {skill.name}
                  </div>
                )
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Formation */}
      {profile.formations && profile.formations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Formation</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {profile.formations.map((edu, index) => (
                <div
                  key={`${edu.degree || edu.school}-${index}`}
                  className="border-l-4 border-secondary pl-4"
                >
                  {edu.degree && (
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  )}
                  {edu.school && (
                    <p className="text-lg text-gray-600">{edu.school}</p>
                  )}
                  {edu.year && (
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  )}
                  {edu.description && (
                    <p className="mt-2 text-gray-700">{edu.description}</p>
                  )}
                  {index < profile.formations?.length - 1 && (
                    <Divider className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Résumé/Description */}
      {profile.summary && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Résumé</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ProfileDetail;
