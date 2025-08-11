import axios from "axios";

// Configuration de base pour Axios
const apiClient = axios.create({
  baseURL: "http://localhost:8085/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Services API
export const profileService = {
  // Récupérer tous les profils
  getAllProfiles: () => {
    return apiClient.get("/profiles");
  },

  // Récupérer un profil par ID
  getProfileById: (id: string | number) => {
    return apiClient.get(`/profile/${id}`);
  },

  // Créer un nouveau profil
  createProfile: (profileData: any) => {
    return apiClient.post("/profiles", profileData);
  },

  // Mettre à jour un profil
  updateProfile: (profileData: any) => {
    return apiClient.put(`/profile`, profileData);
  },

  // Supprimer un profil
  deleteProfile: (id: string | number) => {
    return apiClient.delete(`/profile/${id}`);
  },
};

// Service pour les classifications
export const classificationService = {
  // Classifier un CV unique
  classifySingleCV: (formData: FormData) => {
    return apiClient.post("/ocrsingle", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Classifier plusieurs CVs
  classifyBatchCV: (formData: FormData) => {
    return apiClient.post("/ocrbatch", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Service pour les expériences
export const experienceService = {
  // Récupérer les expériences d'un profil
  getExperiencesByProfileId: (profileId: string | number) => {
    return apiClient.get(`/profile/${profileId}/experiences`);
  },
};

export default apiClient;
