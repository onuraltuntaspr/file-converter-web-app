'use client'

import FileConverter from '../components/FileConverter'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Kapsamlı Dosya Dönüştürücü</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <FileConverter />
        </div>
      </div>
    </main>
  )
}
