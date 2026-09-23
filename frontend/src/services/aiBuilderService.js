import api from '../api/client';

const API_URL = '/api/ai';

export const createProject = async (projectData, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await api.post(`${API_URL}/projects`, projectData, config);
  return response.data;
};

export const getProjects = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await api.get(`${API_URL}/projects`, config);
  return response.data;
};

export const getProjectDetails = async (projectId, token) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await api.get(`${API_URL}/projects/${projectId}`, config);
    return data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData, token) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await api.put(`${API_URL}/projects/${projectId}`, projectData, config);
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId, token) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await api.delete(`${API_URL}/projects/${projectId}`, config);
    return data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const generatePlan = async (projectId, prompt, token, _onChunk) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await api.post(`${API_URL}/generate`, { projectId, promptText: prompt }, config);
  return response.data;
};

export const exportProjectCode = async (projectId, token) => {
  try {
    const config = {
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      responseType: 'blob' // Important to handle the ZIP file stream
    };
    const response = await api.get(`${API_URL}/projects/${projectId}/export`, config);
    
    // Create a temporary link to download the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Try to extract filename from headers, fallback to default
    let filename = 'website_export.zip';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting project:', error);
    throw error;
  }
};
