import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_FILE = join(process.cwd(), 'data', 'manual-videos.json');
const VIDEOS_DIR = join(process.cwd(), 'public', 'uploads', 'videos');

async function readVideosData() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeVideosData(videos: any[]) {
  await writeFile(DATA_FILE, JSON.stringify(videos, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    const name = formData.get('name') as string;
    const script = formData.get('script') as string;
    const thumbnail = formData.get('thumbnail') as File | null;

    if (!video || !name) {
      return NextResponse.json(
        { success: false, error: 'Video and name are required' },
        { status: 400 }
      );
    }

    // Save video file
    const videoBytes = await video.arrayBuffer();
    const videoBuffer = Buffer.from(videoBytes);
    const timestamp = Date.now();
    const videoExtension = video.name.split('.').pop() || 'mp4';
    const videoFilename = `video-${timestamp}.${videoExtension}`;
    const videoPath = join(VIDEOS_DIR, videoFilename);

    await writeFile(videoPath, videoBuffer);

    // Save thumbnail if provided
    let thumbnailUrl = null;
    if (thumbnail) {
      const thumbBytes = await thumbnail.arrayBuffer();
      const thumbBuffer = Buffer.from(thumbBytes);
      const thumbExtension = thumbnail.name.split('.').pop() || 'jpg';
      const thumbFilename = `thumb-${timestamp}.${thumbExtension}`;
      const thumbPath = join(process.cwd(), 'public', 'uploads', 'thumbnails', thumbFilename);
      await writeFile(thumbPath, thumbBuffer);
      thumbnailUrl = `/uploads/thumbnails/${thumbFilename}`;
    }

    // Save metadata
    const metadata = {
      id: timestamp.toString(),
      name,
      script: script || '',
      filename: videoFilename,
      videoUrl: `/uploads/videos/${videoFilename}`,
      thumbnailUrl,
      uploadedAt: new Date().toISOString(),
    };

    const videos = await readVideosData();
    videos.push(metadata);
    await writeVideosData(videos);

    return NextResponse.json({
      success: true,
      video: metadata,
    });
  } catch (error) {
    console.error('Error uploading manual video:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload video',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const videos = await readVideosData();
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error('Error reading videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read videos',
        videos: [],
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const videos = await readVideosData();
    const videoIndex = videos.findIndex((v: any) => v.id === id);

    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    const video = videos[videoIndex];

    // Delete video file
    const videoPath = join(process.cwd(), 'public', video.videoUrl);
    if (existsSync(videoPath)) {
      await unlink(videoPath);
    }

    // Delete thumbnail if exists
    if (video.thumbnailUrl) {
      const thumbPath = join(process.cwd(), 'public', video.thumbnailUrl);
      if (existsSync(thumbPath)) {
        await unlink(thumbPath);
      }
    }

    // Remove from metadata
    videos.splice(videoIndex, 1);
    await writeVideosData(videos);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete video',
      },
      { status: 500 }
    );
  }
}
