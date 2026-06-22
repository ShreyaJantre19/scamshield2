const API_BASE_URL = "http://127.0.0.1:8000";
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const analyzeEmail = async (data) => {
  const response = await API.post("/email/analyze", data);
  return response.data;
};

export async function analyzeURL(url) {
  const response = await fetch(`${API_BASE_URL}/api/url/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getReports() {
  const response = await fetch(`${API_BASE_URL}/reports`);
  return response.json();
}
export async function analyzeFile(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/file/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
}