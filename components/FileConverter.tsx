'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import toast, { Toaster } from 'react-hot-toast'
import FilePreview from './FilePreview'
import * as pdfjs from 'pdfjs-dist'

// Initialize PDF.js with explicit version
const pdfjsVersion = '3.11.174'
const pdfjsWorkerSrc = `/pdf.worker.min.js?v=${pdfjsVersion}`

// Configure PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc

type ConversionFormat = 'jsonl' | 'csv' | 'json'

export default function FileConverter() {
  const [dragActive, setDragActive] = useState(false)
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'converting' | 'success' | 'error'>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ConversionFormat>('jsonl')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setCurrentFile(file)
      handleFiles(file, format)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCurrentFile(file)
      handleFiles(file, format)
    }
  }

  const convertPdfToText = async (file: File): Promise<string> => {
    try {
      console.log('Starting PDF conversion...')
      const arrayBuffer = await file.arrayBuffer()
      console.log('File loaded into ArrayBuffer')
      
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        cMapUrl: '/cmaps/',
        cMapPacked: false,
        verbosity: 1
      })
      console.log('PDF loading task created')
      
      const pdf = await loadingTask.promise
      console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`)
      
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}/${pdf.numPages}`)
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
        console.log(`Page ${i} processed successfully`)
      }

      console.log('PDF conversion completed successfully')
      return fullText
    } catch (error) {
      console.error('Detailed PDF conversion error:', error)
      throw new Error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const convertToFormat = (text: string, format: ConversionFormat): string => {
    const lines = text.split('\n').filter(line => line.trim() !== '')
    
    switch (format) {
      case 'jsonl':
        return lines.map(line => JSON.stringify({ text: line.trim() })).join('\n')
      case 'json':
        return JSON.stringify({ lines: lines.map(line => ({ text: line.trim() })) }, null, 2)
      case 'csv':
        return `text\n${lines.map(line => `"${line.trim().replace(/"/g, '""')}"`).join('\n')}`
      default:
        return text
    }
  }

  const handleFiles = async (file: File, format: ConversionFormat) => {
    setFileName(file.name)
    setConversionStatus('converting')
    setErrorMessage(null)
    setPreviewContent(null)
    setFormat(format)

    const formData = new FormData()
    formData.append('file', file)

    try {
      if (file.name.endsWith('.pdf')) {
        console.log('Starting PDF file conversion process')
        try {
          const pdfText = await convertPdfToText(file)
          console.log(`PDF text extracted successfully, converting to ${format}`)
          
          const convertedData = convertToFormat(pdfText, format)
          
          console.log(`${format.toUpperCase()} conversion completed`)
          setPreviewContent(convertedData)
          setConversionStatus('success')
          toast.success('PDF dosyası başarıyla dönüştürüldü!')
        } catch (error) {
          console.error('Detailed PDF conversion error:', error)
          setConversionStatus('error')
          setErrorMessage(
            error instanceof Error 
              ? `PDF dönüştürme hatası: ${error.message}`
              : 'PDF dosyası dönüştürülürken bir hata oluştu. Lütfen dosyanızı kontrol edin ve tekrar deneyin.'
          )
          toast.error('PDF dönüştürme hatası')
        }
        return
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        const convertedData = convertToFormat(result.data, format)
        setPreviewContent(convertedData)
        setConversionStatus('success')
        toast.success('Dosya başarıyla dönüştürüldü!')
      } else {
        throw new Error(result.error || 'Bilinmeyen bir hata oluştu')
      }
    } catch (error) {
      console.error('Hata:', error)
      setConversionStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'Dönüştürme sırasında bir hata oluştu'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleDownload = () => {
    if (previewContent) {
      const mimeTypes = {
        jsonl: 'application/jsonl',
        json: 'application/json',
        csv: 'text/csv'
      }
      
      const blob = new Blob([previewContent], { type: mimeTypes[format] })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${fileName}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <>
      <Toaster />
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          accept=".xlsx,.xls,.doc,.docx,.pdf,.txt,.csv"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-blue-500 mb-4" />
            <p className="text-lg font-semibold mb-2">Dosyanızı buraya sürükleyip bırakın</p>
            <p className="text-sm text-gray-500 mb-4">veya dosya seçmek için tıklayın</p>
            <p className="text-xs text-gray-400">Desteklenen formatlar: XLSX, XLS, DOC, DOCX, PDF, TXT, CSV (Maksimum 200MB)</p>
          </div>
        </label>
      </div>
      <div className="mt-6 text-center">
        {conversionStatus === 'converting' && (
          <div className="flex items-center justify-center text-blue-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <p>{fileName} dönüştürülüyor...</p>
          </div>
        )}
        {conversionStatus === 'success' && (
          <div className="flex items-center justify-center text-green-500">
            <CheckCircle className="w-6 h-6 mr-2" />
            <p>{fileName} başarıyla dönüştürüldü!</p>
          </div>
        )}
        {conversionStatus === 'error' && (
          <div className="flex items-center justify-center text-red-500">
            <XCircle className="w-6 h-6 mr-2" />
            <p>{fileName} dönüştürülürken hata oluştu: {errorMessage}</p>
          </div>
        )}
      </div>
      {previewContent && (
        <div className="mt-6">
          <FilePreview content={previewContent} />
          <Button onClick={handleDownload} className="mt-4">Dönüştürülen Dosyayı İndir</Button>
        </div>
      )}
      <div className="mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">Dönüştürme Seçenekleri</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => currentFile && handleFiles(currentFile, 'jsonl')}>
              JSONL'ye Dönüştür
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => currentFile && handleFiles(currentFile, 'csv')}>
              CSV'ye Dönüştür
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => currentFile && handleFiles(currentFile, 'json')}>
              JSON'a Dönüştür
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
