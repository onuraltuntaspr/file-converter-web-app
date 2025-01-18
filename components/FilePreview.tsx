import React from 'react'

interface FilePreviewProps {
  content: string
}

const FilePreview: React.FC<FilePreviewProps> = ({ content }) => {
  const lines = content.split('\n')
  const previewLines = lines.slice(0, 10) // İlk 10 satırı göster

  return (
    <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
      <h3 className="text-xl font-bold mb-2 text-center text-blue-600">Önizleme (İlk 10 Satır)</h3>
      <pre className="text-sm">
        {previewLines.join('\n')}
        {lines.length > 10 && '\n...'}
      </pre>
    </div>
  )
}

export default FilePreview
