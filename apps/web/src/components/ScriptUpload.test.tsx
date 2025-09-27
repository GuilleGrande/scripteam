import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// All mocks must be at the top level before any imports
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  apiClient: {
    uploadScript: vi.fn(),
  },
}))

vi.mock('@/lib/mock-data', () => ({
  processingPhases: [
    { phase: 'parsing', message: 'Parsing script...', duration: 2 },
    { phase: 'analyzing', message: 'Analyzing characters...', duration: 3 },
    { phase: 'generating', message: 'Generating voices...', duration: 4 },
  ],
}))

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
}))

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, ...props }: { value?: number } & React.ComponentProps<'div'>) => <div role="progressbar" aria-valuenow={value} {...props} />,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Upload: () => <div data-testid="upload-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
}))

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(' '),
}))

// Now import the modules after mocking
import ScriptUpload from './ScriptUpload'
import { apiClient } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

const mockToast = vi.mocked(toast)
const mockApiClient = vi.mocked(apiClient)

describe('ScriptUpload Component', () => {
  const mockOnUploadComplete = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial Render', () => {
    it('renders upload interface correctly', () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      expect(screen.getByText('Upload Your Script')).toBeInTheDocument()
      expect(screen.getByText('Get AI-powered scene partners in minutes')).toBeInTheDocument()
      expect(screen.getByText('Drop your script here')).toBeInTheDocument()
      expect(screen.getByText('or click to browse files')).toBeInTheDocument()
      expect(screen.getByText('PDF')).toBeInTheDocument()
      expect(screen.getByText('TXT')).toBeInTheDocument()
    })

    it('shows what happens next section', () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      expect(screen.getByText('What happens next?')).toBeInTheDocument()
      expect(screen.getByText('AI analyzes your script and characters')).toBeInTheDocument()
      expect(screen.getByText('Creates unique voices for each character')).toBeInTheDocument()
      expect(screen.getByText('Ready to practice in 90-120 seconds')).toBeInTheDocument()
    })

    it('has hidden file input with correct attributes', () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const fileInput = screen.getByDisplayValue('')
      expect(fileInput).toHaveAttribute('type', 'file')
      expect(fileInput).toHaveAttribute('accept', '.pdf,.txt')
      expect(fileInput).toHaveClass('hidden')
    })
  })

  describe('File Selection', () => {
    it('handles valid PDF file selection', async () => {
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload started",
          description: "Processing test.pdf...",
        })
      })
    })

    it('handles valid TXT file selection', async () => {
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload started",
          description: "Processing test.txt...",
        })
      })
    })

    it('rejects invalid file types', async () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.doc', { type: 'application/msword' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Invalid file type",
          description: "Please upload a PDF or TXT file",
          variant: "destructive",
        })
      })
    })
  })

  describe('Drag and Drop', () => {
    it('handles drag over events', () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const dropZone = screen.getByText('Drop your script here').closest('.cursor-pointer')
      expect(dropZone).toBeInTheDocument()

      fireEvent.dragOver(dropZone!, { preventDefault: vi.fn() })

      expect(dropZone).toHaveClass('cursor-pointer')
    })

    it('handles file drop', async () => {
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const dropZone = screen.getByText('Drop your script here').closest('.cursor-pointer')

      fireEvent.drop(dropZone!, {
        dataTransfer: {
          files: [file],
        },
        preventDefault: vi.fn(),
      })

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload started",
          description: "Processing test.pdf...",
        })
      })
    })

    it('handles drag leave events', () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const dropZone = screen.getByText('Drop your script here').closest('.cursor-pointer')

      fireEvent.dragLeave(dropZone!, { preventDefault: vi.fn() })

      expect(dropZone).toBeInTheDocument()
    })
  })

  describe('Upload Process', () => {
    it('calls API client upload method', async () => {
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(apiClient.uploadScript).toHaveBeenCalledWith(file)
      })
    })

    it('handles upload API errors', async () => {
      const errorMessage = 'Upload failed'
      mockApiClient.uploadScript.mockRejectedValue(new Error(errorMessage))
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        })
      })
    })

    it('handles generic upload errors', async () => {
      mockApiClient.uploadScript.mockRejectedValue('Network error')
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload failed",
          description: "Failed to upload script",
          variant: "destructive",
        })
      })
    })
  })

  describe('Processing UI', () => {
    it('shows processing UI during upload', async () => {
      vi.useFakeTimers()
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      // Wait for upload to complete first
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload started",
          description: "Processing test.pdf...",
        })
      })

      // Now advance timers to show processing UI
      vi.advanceTimersByTime(1500)

      await waitFor(() => {
        expect(screen.getByText('AI Processing Your Script')).toBeInTheDocument()
        expect(screen.getByText('Creating your personalized practice experience')).toBeInTheDocument()
      }, { timeout: 10000 })
    }, 15000)

    it('completes processing and calls onUploadComplete', async () => {
      vi.useFakeTimers()
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      // Wait for upload to complete first
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload started",
          description: "Processing test.pdf...",
        })
      })

      // Fast forward through all processing phases
      vi.advanceTimersByTime(15000)

      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalled()
      }, { timeout: 10000 })
    }, 20000)

    it('shows progress during processing', async () => {
      vi.useFakeTimers()
      mockApiClient.uploadScript.mockResolvedValue({ success: true })
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByDisplayValue('')

      await user.upload(fileInput, file)

      // Wait for upload to complete first
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Upload started",
          description: "Processing test.pdf...",
        })
      })

      // Fast forward to middle of processing
      vi.advanceTimersByTime(3000)

      await waitFor(() => {
        const progressElement = screen.getByRole('progressbar')
        expect(progressElement).toBeInTheDocument()
      }, { timeout: 10000 })
    }, 15000)
  })

  describe('Click to Upload', () => {
    it('opens file picker when clicking upload area', async () => {
      render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />)

      const uploadArea = screen.getByText('Drop your script here').closest('.cursor-pointer')
      const fileInput = screen.getByDisplayValue('')

      const clickSpy = vi.spyOn(fileInput, 'click').mockImplementation(() => {})

      await user.click(uploadArea!)

      expect(clickSpy).toHaveBeenCalled()

      clickSpy.mockRestore()
    })
  })
})