import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'REPLICATE_API_TOKEN not configured' },
        { status: 500 }
      );
    }

    // Convert image to base64 data URL
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = image.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('Running Replicate model for character creation...');

    // Run the consistent-character model
    const output = await replicate.run(
      "fofr/consistent-character:5f14f3b25fdaf50818d520ffb23c7da51f71fe3b95bd9a79c30fe54fa3e5eed7",
      {
        input: {
          prompt: "cartoon character, pixar style, 3d render, high quality, cute, friendly, colorful",
          subject: dataUrl,
          output_format: "png",
          output_quality: 90,
          negative_prompt: "scary, dark, realistic, photo, low quality",
          number_of_outputs: 1,
          randomise_poses: false,
          number_of_images_per_pose: 1,
        }
      }
    );

    console.log('Replicate output:', output);

    // Extract the image URL from the output
    let imageUrl: string | undefined;

    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'No image generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create character'
      },
      { status: 500 }
    );
  }
}
