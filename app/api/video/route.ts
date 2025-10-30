import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const DID_API_URL = 'https://api.d-id.com/talks';

export async function POST(request: NextRequest) {
  try {
    const { script, imageUrl } = await request.json();

    if (!script || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Script and image URL are required' },
        { status: 400 }
      );
    }

    if (script.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Script must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (!process.env.DID_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'DID_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('Creating D-ID video...');

    // Create the talking video using D-ID API
    const response = await axios.post(
      DID_API_URL,
      {
        source_url: imageUrl,
        script: {
          type: 'text',
          input: script,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural',
          },
        },
        config: {
          fluent: true,
          pad_audio: 0,
          driver_expressions: {
            expressions: [
              { expression: 'happy', start_frame: 0, intensity: 0.8 }
            ]
          },
          stitch: true,
        },
      },
      {
        headers: {
          'Authorization': `Basic ${process.env.DID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const videoId = response.data.id;
    const status = response.data.status;

    console.log('D-ID video created:', { videoId, status });

    // If video is already done (unlikely but possible)
    if (status === 'done' && response.data.result_url) {
      return NextResponse.json({
        success: true,
        videoUrl: response.data.result_url,
        videoId,
      });
    }

    // Return video ID for polling
    return NextResponse.json({
      success: true,
      videoId,
      status,
    });
  } catch (error) {
    console.error('Error creating video:', error);

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { success: false, error: `D-ID API error: ${message}` },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create video'
      },
      { status: 500 }
    );
  }
}
