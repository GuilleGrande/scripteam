import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiClient } from './api'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ApiClient', () => {
  let apiClient: ApiClient
  const mockBaseUrl = 'http://test-api:3001'

  beforeEach(() => {
    vi.clearAllMocks()
    apiClient = new ApiClient(mockBaseUrl)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Constructor', () => {
    it('initializes with provided base URL', () => {
      const client = new ApiClient('http://custom:3000')
      // We can't directly test the private baseUrl, but we can test behavior
      expect(client).toBeInstanceOf(ApiClient)
    })

    it('uses default URL when none provided', () => {
      const client = new ApiClient()
      expect(client).toBeInstanceOf(ApiClient)
    })
  })

  describe('healthCheck', () => {
    it('makes successful health check request', async () => {
      const mockResponse = { status: 'ok' }
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await apiClient.healthCheck()

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/health`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('throws error on failed health check', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      })

      await expect(apiClient.healthCheck()).rejects.toThrow('HTTP error! status: 500')
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(apiClient.healthCheck()).rejects.toThrow('Network error')
    })
  })

  describe('uploadScript', () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

    it('uploads file successfully', async () => {
      const mockResponse = {
        id: 'script-123',
        filename: 'test.pdf',
        status: 'uploaded'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await apiClient.uploadScript(mockFile)

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/scripts`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      )

      // Verify FormData contains the file
      const formData = mockFetch.mock.calls[0][1].body as FormData
      expect(formData.get('file')).toBe(mockFile)
      expect(result).toEqual(mockResponse)
    })

    it('handles upload with different file types', async () => {
      const txtFile = new File(['text content'], 'test.txt', { type: 'text/plain' })
      const mockResponse = { id: 'script-456', filename: 'test.txt' }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await apiClient.uploadScript(txtFile)

      const formData = mockFetch.mock.calls[0][1].body as FormData
      expect(formData.get('file')).toBe(txtFile)
      expect(result).toEqual(mockResponse)
    })

    it('throws error on upload failure with status code', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 413,
      })

      await expect(apiClient.uploadScript(mockFile)).rejects.toThrow('Upload failed: 413')
    })

    it('handles different HTTP error status codes', async () => {
      const testCases = [
        { status: 400, expectedError: 'Upload failed: 400' },
        { status: 401, expectedError: 'Upload failed: 401' },
        { status: 403, expectedError: 'Upload failed: 403' },
        { status: 404, expectedError: 'Upload failed: 404' },
        { status: 500, expectedError: 'Upload failed: 500' },
      ]

      for (const testCase of testCases) {
        mockFetch.mockResolvedValue({
          ok: false,
          status: testCase.status,
        })

        await expect(apiClient.uploadScript(mockFile)).rejects.toThrow(testCase.expectedError)
      }
    })

    it('handles network errors during upload', async () => {
      mockFetch.mockRejectedValue(new Error('Network connection failed'))

      await expect(apiClient.uploadScript(mockFile)).rejects.toThrow('Network connection failed')
    })

    it('handles malformed JSON response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(apiClient.uploadScript(mockFile)).rejects.toThrow('Invalid JSON')
    })

    it('does not include Content-Type header for FormData', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 'test' }),
      })

      await apiClient.uploadScript(mockFile)

      const fetchCall = mockFetch.mock.calls[0]
      const options = fetchCall[1]

      // FormData requests should not have Content-Type header (browser sets it automatically)
      expect(options.headers).toBeUndefined()
    })
  })

  describe('getScript', () => {
    it('retrieves script by ID successfully', async () => {
      const mockScript = {
        id: 'script-123',
        filename: 'test.pdf',
        content: 'Script content...',
        characters: ['Alice', 'Bob'],
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockScript),
      })

      const result = await apiClient.getScript('script-123')

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/scripts/script-123`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockScript)
    })

    it('throws error when script not found', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      })

      await expect(apiClient.getScript('nonexistent-id')).rejects.toThrow('HTTP error! status: 404')
    })

    it('handles server errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      })

      await expect(apiClient.getScript('script-123')).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('Error Handling', () => {
    it('handles fetch timeout', async () => {
      mockFetch.mockImplementation(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      )

      await expect(apiClient.healthCheck()).rejects.toThrow('Request timeout')
    })

    it('handles malformed URL responses', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))

      await expect(apiClient.healthCheck()).rejects.toThrow('Failed to fetch')
    })
  })

  describe('API URL Configuration', () => {
    it('constructs correct URLs for different endpoints', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      // Test health check URL
      await apiClient.healthCheck()
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${mockBaseUrl}/health`,
        expect.any(Object)
      )

      // Test script retrieval URL
      await apiClient.getScript('test-id')
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${mockBaseUrl}/api/scripts/test-id`,
        expect.any(Object)
      )

      // Test upload URL
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      })

      await apiClient.uploadScript(mockFile)
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${mockBaseUrl}/api/scripts`,
        expect.any(Object)
      )
    })
  })
})