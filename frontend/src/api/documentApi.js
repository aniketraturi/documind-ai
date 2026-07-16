import { apiClient } from "./client";

export const uploadDocument = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await apiClient.get("/documents");

  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await apiClient.delete(`/documents/${documentId}`);

  return response.data;
};

export const getDocumentById = async (documentId) => {
  const response = await apiClient.get(`/documents/${documentId}`);

  return response.data;
};

export const getDocumentChunks = async (documentId) => {
  const response = await apiClient.get(`/documents/${documentId}/chunks`);

  return response.data;
};

export const processDocument = async (documentId) => {
  const response = await apiClient.post(`/documents/${documentId}/process`);

  return response.data;
};

export const chunkDocument = async (documentId) => {
  const response = await apiClient.post(`/documents/${documentId}/chunk`);

  return response.data;
};

export const embedDocument = async (documentId) => {
  const response = await apiClient.post(`/documents/${documentId}/embed`);

  return response.data;
};

export const searchDocument = async ({ documentId, query, topK }) => {
  const response = await apiClient.post(`/documents/${documentId}/search`, {
    query,
    top_k: topK,
  });

  return response.data;
};
