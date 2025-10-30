# Tolly - Create Cartoon Characters & Talking Videos

A fun, family-friendly web application that transforms photos into cartoon characters and makes them talk! Perfect for parents, teachers, and content creators.

## Features

### 1. Character Creation
- Upload any photo
- AI-powered transformation into a Pixar-style cartoon character
- Instant preview and comparison
- High-quality image generation

### 2. Video Generation
- Create talking videos with your cartoon characters
- Text-to-speech with natural voice
- 30-second videos perfect for storytelling
- Download videos to share

### 3. User-Friendly Design
- Clean, intuitive interface
- Suitable for parents and teachers
- Real-time loading states
- Clear error messages
- Mobile-responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - [Replicate](https://replicate.com/) - Character creation (fofr/consistent-character)
  - [D-ID](https://www.d-id.com/) - Talking video generation

## Prerequisites

Before you begin, you'll need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **API Keys**:
   - Replicate API Token: Get it from [Replicate Account](https://replicate.com/account/api-tokens)
   - D-ID API Key: Get it from [D-ID Studio](https://studio.d-id.com/account-settings)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tolly-mvp-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   DID_API_KEY=your_did_api_key_here
   ```

   **Important**: Never commit your `.env` file to version control!

## Getting Your API Keys

### Replicate API Token

1. Go to [Replicate](https://replicate.com/)
2. Sign up or log in
3. Navigate to [Account Settings > API Tokens](https://replicate.com/account/api-tokens)
4. Create a new token or copy your existing token
5. Add it to your `.env` file as `REPLICATE_API_TOKEN`

### D-ID API Key

1. Go to [D-ID Studio](https://studio.d-id.com/)
2. Sign up or log in
3. Navigate to [Account Settings](https://studio.d-id.com/account-settings)
4. Find your API Key in the API section
5. Add it to your `.env` file as `DID_API_KEY`

**Note**: Both services offer free tiers with limited credits. Check their pricing pages for details.

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## How to Use

### Step 1: Create Your Character

1. Click the upload area in the "Create Your Character" section
2. Select a photo from your device (PNG, JPG, up to 10MB)
3. Preview your selected photo
4. Click "Create Character"
5. Wait 30-60 seconds for the AI to generate your cartoon character
6. View the side-by-side comparison

### Step 2: Make It Talk

1. After creating a character, the "Make Your Character Talk" section becomes active
2. Enter your script (max 500 characters)
3. Click "Generate Talking Video"
4. Wait 1-2 minutes for video generation
5. Watch your character come to life!
6. Download the video to share

## Project Structure

```
tolly-mvp-app/
├── app/
│   ├── api/
│   │   ├── character/
│   │   │   └── route.ts          # Replicate character creation endpoint
│   │   └── video/
│   │       ├── route.ts           # D-ID video creation endpoint
│   │       └── status/
│   │           └── route.ts       # Video status polling endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   ├── CharacterCreator.tsx       # Character creation UI
│   ├── VideoGenerator.tsx         # Video generation UI
│   ├── LoadingSpinner.tsx         # Loading state component
│   └── ErrorAlert.tsx             # Error display component
├── types/
│   └── index.ts                   # TypeScript type definitions
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── .gitignore
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json
└── README.md
```

## API Endpoints

### POST /api/character
Creates a cartoon character from an uploaded photo.

**Request**: `multipart/form-data`
- `image`: Image file (PNG, JPG)

**Response**:
```json
{
  "success": true,
  "imageUrl": "https://..."
}
```

### POST /api/video
Creates a talking video with the character.

**Request**:
```json
{
  "script": "Your text script here",
  "imageUrl": "https://..."
}
```

**Response**:
```json
{
  "success": true,
  "videoId": "video-id",
  "status": "processing"
}
```

### GET /api/video/status?videoId=xxx
Checks the status of video generation.

**Response**:
```json
{
  "status": "done",
  "videoUrl": "https://..."
}
```

## Error Handling

The application includes comprehensive error handling:

- **Network errors**: Displays user-friendly error messages
- **API failures**: Shows specific error details
- **File validation**: Checks file type and size before upload
- **Script validation**: Enforces character limit
- **Loading states**: Clear feedback during processing

## Troubleshooting

### "API key not configured" error
- Make sure your `.env` file exists in the root directory
- Check that API keys are properly set without quotes
- Restart the development server after adding environment variables

### Character creation takes too long
- Large images may take longer to process
- Try using a smaller image (under 2MB recommended)
- Check your internet connection

### Video generation fails
- Verify your D-ID API key has available credits
- Make sure the character image URL is accessible
- Check that your script is under 500 characters

### Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Performance Considerations

- **Character creation**: Takes 30-60 seconds on average
- **Video generation**: Takes 1-2 minutes on average
- **Image size**: Keep uploads under 10MB for best performance
- **Script length**: Shorter scripts generate faster videos

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

This is an MVP (Minimum Viable Product). Future enhancements could include:

- [ ] Multiple voice options
- [ ] Custom character styles
- [ ] Batch processing
- [ ] Video editing features
- [ ] Character gallery
- [ ] Social sharing integration

## Security Notes

- API keys are stored server-side only
- Never expose API keys in client-side code
- `.env` file is gitignored by default
- File uploads are validated for type and size

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the API documentation:
   - [Replicate Docs](https://replicate.com/docs)
   - [D-ID API Docs](https://docs.d-id.com/)

## Credits

- Character generation powered by [Replicate](https://replicate.com/)
- Video generation powered by [D-ID](https://www.d-id.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for parents, teachers, and storytellers
