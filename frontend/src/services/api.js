import axios from "axios";

const API_BASE_URL = "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeEmail = async (data) => {
  const response = await API.post("/email/analyze", data);
  return response.data;
};

export async function analyzeURL(url) {
  const response = await fetch(`${API_BASE_URL}/scan/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Server error: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function getReports() {
  const response = await fetch(
    `${API_BASE_URL}/history`
  );

  return response.json();
}

export async function askChatbot(message) {
  const response = await fetch(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  return response.json();
}

export async function analyzeFile(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/file/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
}
