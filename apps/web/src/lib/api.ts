// API client configuration for ScripTeam
// Use localhost when running in browser, api when running in Docker
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? 'http://localhost:3001' : 'http://api:3001');

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    console.log('🔗 API Client initialized with URL:', this.baseUrl);
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
    console.log('🏥 Testing health check at:', `${this.baseUrl}/health`);
    return this.request('/health');
  }

  // Script upload endpoint
  async uploadScript(file: File) {
    console.log('📤 Uploading script to:', `${this.baseUrl}/api/scripts`);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/scripts`, {
      method: 'POST',
      body: formData,
    });

    console.log('📤 Upload response status:', response.status);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('📤 Upload result:', result);
    return result;
  }

  // Get script by ID
  async getScript(id: string) {
    return this.request(`/api/scripts/${id}`);
  }
}

export const apiClient = new ApiClient();