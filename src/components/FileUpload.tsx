'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useTheme } from '@/app/contexts/ThemeContext'

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const { theme } = useTheme()
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    console.log('Dropped file:', file)
    onFileSelect(file)

    if (file.type.startsWith('image/')) {
      setFileType('image')
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('video/')) {
      setFileType('video')
      setPreview(URL.createObjectURL(file))
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm']
    },
    multiple: false
  })

  const removeFile = () => {
    setPreview(null)
    setFileType(null)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : `${theme === 'dark' ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
          Drag & drop an image or video here, or click to select
        </p>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Supported formats: PNG, JPG, GIF, MP4, WEBM
        </p>
      </div>

      {preview && (
        <div className="relative">
          {fileType === 'image' && (
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              className="rounded-lg mx-auto"
            />
          )}
          {fileType === 'video' && (
            <video
              src={preview}
              controls
              className="rounded-lg mx-auto"
              style={{ maxWidth: '300px', maxHeight: '300px' }}
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

