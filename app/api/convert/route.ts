export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import { parse as csvParse } from 'csv-parse/sync'
import { fileTypeFromBuffer } from 'file-type'

async function convertExcelToJson(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json(sheet)
}

async function convertWordToText(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

async function convertCsvToJson(buffer: Buffer) {
  const content = buffer.toString('utf-8')
  return csvParse(content, { columns: true, skip_empty_lines: true })
}

async function convertToJsonl(buffer: Buffer, originalFilename: string) {
  const fileType = await fileTypeFromBuffer(buffer)
  console.log('Tespit edilen dosya tipi:', fileType?.ext)

  let data
  if (originalFilename.toLowerCase().endsWith('.xlsx') || originalFilename.toLowerCase().endsWith('.xls')) {
    data = await convertExcelToJson(buffer)
  } else if (originalFilename.toLowerCase().endsWith('.docx') || originalFilename.toLowerCase().endsWith('.doc')) {
    data = await convertWordToText(buffer)
  } else if (originalFilename.toLowerCase().endsWith('.csv')) {
    data = await convertCsvToJson(buffer)
  } else if (originalFilename.toLowerCase().endsWith('.txt')) {
    data = buffer.toString('utf-8')
  } else {
    throw new Error(`Desteklenmeyen dosya formatı. Dosya adı: ${originalFilename}, Tespit edilen format: ${fileType?.ext}`)
  }

  let jsonlData
  if (Array.isArray(data)) {
    jsonlData = data.map(item => JSON.stringify(item)).join('\n')
  } else {
    jsonlData = data
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: string) => JSON.stringify({ text: line.trim() }))
      .join('\n')
  }

  return jsonlData
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'Dosya yüklenmedi' }, { status: 400 })
    }

    if (file.size > 200 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Dosya boyutu 200MB\'ı aşamaz' }, { status: 400 })
    }

    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv', 'text/plain']
    console.log('Dosya tipi:', file.type);
    console.log('Dosya adı:', file.name);
    console.log('Dosya boyutu:', file.size);

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ 
        success: false, 
        error: `Desteklenmeyen dosya türü. Dosya tipi: ${file.type}, Desteklenen tipler: ${allowedTypes.join(', ')}` 
      }, { status: 400 })
    }

    if (file.name.endsWith('.pdf')) {
      // For PDF files, we'll handle conversion client-side
      return NextResponse.json({ success: true, isPdf: true })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const jsonlData = await convertToJsonl(buffer, file.name)

    return NextResponse.json({
      success: true,
      data: jsonlData,
      filename: `${file.name}.jsonl`
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Dönüştürme hatası:', error)
    return NextResponse.json({
      success: false,
      error: 'Dosya dönüştürme sırasında hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
