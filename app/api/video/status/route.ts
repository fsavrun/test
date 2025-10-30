import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const DID_API_URL = 'https://api.d-id.com/talks';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    if (!process.env.DID_API_KEY) {
      return NextResponse.json(
        { error: 'DID_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('Checking video status:', videoId);

    // Check video status using D-ID API
    const response = await axios.get(
      `${DID_API_URL}/${videoId}`,
      {
        headers: {
          'Authorization': `Basic ${process.env.DID_API_KEY}`,
        },
      }
    );

    const { status, result_url, error } = response.data;

    console.log('Video status:', { status, result_url, error });

    return NextResponse.json({
      status,
      videoUrl: result_url,
      error: error?.description,
    });
  } catch (error) {
    console.error('Error checking video status:', error);

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: `D-ID API error: ${message}` },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check video status'
      },
      { status: 500 }
    );
  }
}
