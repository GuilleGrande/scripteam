// API client configuration for ScripTeam
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health check endpoint
  async healthCheck() {
    return this.request('/health');
  }

  // Script upload endpoint
  async uploadScript(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/scripts`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Get script by ID
  async getScript(id: string) {
    return this.request(`/scripts/${id}`);
  }
}

export const apiClient = new ApiClient();