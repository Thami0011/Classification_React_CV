import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import userImage from "@/assets/user.png";
import { useNavigate } from "react-router-dom";
import { profileService } from "../config/apiService";

interface Experience {
  company: string;
  title: string;
  dateRange?: string;
  description?: string;
}

export interface Profile {
  id: number;
  title: string;
  description: string;
  expériences: Experience[];
  certifications: string[];
  langues: string[];
  ville: string;
  "poste visé": string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  competences_techniques?: string[];
  formations?: any[];
  summary?: string;
}

const ProfilePage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await profileService.getAllProfiles();
        setProfiles(response.data);
      } catch (err: any) {
        console.error("Erreur lors du chargement des profils:", err);
        setError(err.message || "Échec du chargement des profils.");
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []); // Suppression de profiles de la dépendance pour éviter les boucles infinies

  const handleProfileClick = (profileId: number) => {
    navigate(`/profileDetail`, { state: { profileId } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Chargement des profils..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <h2 className="text-xl font-bold text-danger mb-2">Erreur</h2>
            <p className="text-gray-600">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <h2 className="text-xl font-bold mb-2">Aucun profil trouvé</h2>
            <p className="text-gray-600">
              Il n'y a actuellement aucun profil disponible.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Profils disponibles
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className="shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300"
            isPressable
            onPress={() => handleProfileClick(profile.id)}
          >
            <CardBody className="flex flex-col items-center p-6">
              <Image
                src={userImage}
                alt={profile.title || profile.name || "Profil"}
                className="rounded-lg object-cover mx-auto w-20 h-20 mb-4"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {profile.title || profile.name || "Profil sans nom"}
                </h3>
                {profile.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {profile.description}
                  </p>
                )}
                {profile["poste visé"] && (
                  <p className="text-sm text-primary mt-2 font-medium">
                    {profile["poste visé"]}
                  </p>
                )}
                {profile.ville && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {profile.ville}
                  </p>
                )}
              </div>
            </CardBody>
            <CardFooter className="text-center pt-0">
              <div className="w-full">
                {profile.expériences && profile.expériences.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {profile.expériences.length} expérience
                    {profile.expériences.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
