import { NextRequest, NextResponse } from 'next/server'
import { storage, config } from '@/lib/appwrite'

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Get file download URL from Appwrite
    const downloadUrl = storage.getFileDownload(config.storageId, fileId)
    
    // Redirect to the download URL
    return NextResponse.redirect(downloadUrl)
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
} 