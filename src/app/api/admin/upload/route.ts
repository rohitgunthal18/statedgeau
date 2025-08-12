import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general'; // featured, content, general
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    
    // Determine storage folder based on type
    const folder = type === 'featured' ? 'featured-images' : 
                  type === 'content' ? 'content-images' : 'general';
    const filePath = `${folder}/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    // Get image dimensions (if it's an image)
    let width: number | null = null;
    let height: number | null = null;
    
    if (file.type.startsWith('image/')) {
      try {
        // Create image element to get dimensions
        const imageBlob = new Blob([fileBuffer], { type: file.type });
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Note: In a real implementation, you might want to use a library like 'sharp' 
        // for server-side image processing and dimension extraction
        // For now, we'll set them as null and let the client handle it
      } catch (error) {
        console.warn('Could not extract image dimensions:', error);
      }
    }

    // Store metadata in database
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        filename: fileName,
        original_name: file.name,
        file_path: filePath,
        url: urlData.publicUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        file_size: file.size,
        mime_type: file.type,
        width,
        height,
        folder,
        upload_folder: folder,
        optimization_status: 'pending',
        is_optimized: false,
        uploaded_by: 'admin'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the upload, just log the error
      console.warn('Failed to store media metadata in database');
    }

    // Return success response
    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      folder,
      id: mediaRecord?.id || null,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}

// Handle file deletion
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const filePath = searchParams.get('path');

    if (!fileId && !filePath) {
      return NextResponse.json(
        { error: 'File ID or path required' },
        { status: 400 }
      );
    }

    let mediaRecord = null;

    // Get media record from database
    if (fileId) {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      mediaRecord = data;
    }

    const pathToDelete = mediaRecord?.file_path || filePath;

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('media')
      .remove([pathToDelete!]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete file: ' + deleteError.message },
        { status: 500 }
      );
    }

    // Delete from database
    if (fileId) {
      const { error: dbDeleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', fileId);

      if (dbDeleteError) {
        console.warn('Failed to delete media record from database:', dbDeleteError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error during deletion' },
      { status: 500 }
    );
  }
}

// Get media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (folder && folder !== 'all') {
      query = query.eq('folder', folder);
    }

    const { data: mediaFiles, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch media files' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      files: mediaFiles || [],
      count: mediaFiles?.length || 0
    });

  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 