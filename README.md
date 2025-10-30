# Tolly - Create Cartoon Characters & Talking Videos

A fun, family-friendly web application that transforms photos into cartoon characters and makes them talk! Perfect for parents, teachers, and content creators.

## 🌟 Key Features

### 🎭 Two Ways to Create Characters
1. **Upload Photo** - Transform any photo into a Pixar-style cartoon character
2. **Browse Templates** - Choose from 8 pre-made character templates

### ✨ Character Customization
- Name your character (up to 30 characters)
- Choose emotions: Happy, Sad, Excited, Thoughtful, Surprised
- Select background colors (8 beautiful options)
- Real-time preview

### 📝 Story Creation
- Write scripts (up to 500 characters)
- AI-powered text-to-speech
- Natural voice generation
- Example prompts provided

### 🎬 Video Generation
- 30-second talking videos
- High-quality output
- Download in MP4 format
- Shareable links

### 👨‍💼 Admin Features
- Manual video upload
- Pre-recorded video management
- Testing and demo support
- Metadata management

## 🚀 User Flow

```
1. Landing Page
   ├─> Upload Photo ──────────┐
   └─> Browse Templates ──────┤
                               │
2. Character Customization <───┘
   (Name, Emotion, Background)
   │
3. Story Input
   (Write Script)
   │
4. Video Generation
   (AI Processing)
   │
5. Video Result
   (Download & Share)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Orange Theme)
- **State Management**: React Context API
- **APIs**:
  - [Replicate](https://replicate.com/) - Character creation (fofr/consistent-character)
  - [D-ID](https://www.d-id.com/) - Talking video generation

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **API Keys**:
   - Replicate API Token: [Get it here](https://replicate.com/account/api-tokens)
   - D-ID API Key: [Get it here](https://studio.d-id.com/account-settings)

## 🔧 Installation

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
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   DID_API_KEY=your_did_api_key_here
   ```

4. **Create required directories**:
   ```bash
   mkdir -p public/uploads/videos public/uploads/thumbnails
   ```

## 🎯 Getting Your API Keys

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

**Note**: Both services offer free tiers with limited credits.

## 🏃 Running the Application

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

## 📖 How to Use

### Step 1: Choose Your Character Creation Method

**Option A: Upload Photo**
1. Click "Upload Photo" on the landing page
2. Select a clear, well-lit photo
3. Wait 30-60 seconds for AI processing
4. View your cartoon character

**Option B: Browse Templates**
1. Click "Browse Templates" on the landing page
2. Choose from 8 character templates:
   - Happy Kid 😊
   - Cool Kid 😎
   - Friendly Teen 🎓
   - Sporty Teen ⚽
   - Professional 💼
   - Creative Artist 🎨
   - Clever Cat 🐱
   - Loyal Dog 🐶
3. Instantly select and customize

### Step 2: Customize Your Character

1. Enter a character name
2. Choose an emotion/expression
3. Select a background color
4. Preview in real-time
5. Click "Next: Create Story"

### Step 3: Write Your Story

1. Enter your script (max 500 characters)
2. Use example prompts for inspiration
3. Preview your character
4. Click "Generate Video"

### Step 4: Watch & Download

1. Wait 1-2 minutes for video generation
2. Watch your character come to life!
3. Download the video (MP4)
4. Share with friends and family
5. Create another character

## 👨‍💼 Admin Area - Manual Upload

Access at: [http://localhost:3000/manual-upload](http://localhost:3000/manual-upload)

### Upload Pre-recorded Videos

1. Navigate to `/manual-upload`
2. Enter character name
3. Upload video file (MP4, MOV, WebM - Max 50MB)
4. Optionally upload thumbnail
5. Add script/description
6. Click "Save Video"

### Using Manual Videos

1. On the Story Input page
2. Toggle to "Use Uploaded Video"
3. Select from dropdown
4. Proceed to result page

## 📁 Project Structure

```
tolly-mvp-app/
├── app/
│   ├── api/
│   │   ├── character/route.ts          # Replicate character creation
│   │   ├── video/route.ts              # D-ID video creation
│   │   ├── video/status/route.ts       # Video status polling
│   │   └── upload-manual/route.ts      # Manual video upload/management
│   ├── create/
│   │   ├── upload/page.tsx             # Photo upload page
│   │   ├── templates/page.tsx          # Template selection page
│   │   └── customize/page.tsx          # Character customization
│   ├── story/page.tsx                  # Script input page
│   ├── result/page.tsx                 # Video result page
│   ├── manual-upload/page.tsx          # Admin upload page
│   ├── layout.tsx                      # Root layout with context
│   ├── page.tsx                        # Landing page
│   └── globals.css                     # Global styles
├── components/
│   ├── LandingHero.tsx                 # Landing page hero section
│   ├── TemplateGallery.tsx             # Character template grid
│   ├── CharacterCustomizer.tsx         # Customization controls
│   ├── StoryInput.tsx                  # Script input component
│   ├── VideoPlayer.tsx                 # Video player with controls
│   ├── ProgressIndicator.tsx           # Loading/progress animation
│   ├── LoadingSpinner.tsx              # Generic loading spinner
│   └── ErrorAlert.tsx                  # Error message display
├── contexts/
│   └── CharacterContext.tsx            # React Context for state
├── types/
│   ├── index.ts                        # API type definitions
│   └── templates.ts                    # Template & config types
├── data/
│   └── manual-videos.json              # Manual video metadata
├── public/
│   ├── templates/                      # Character template images
│   └── uploads/
│       ├── videos/                     # Uploaded videos
│       └── thumbnails/                 # Video thumbnails
├── .env.example                        # Environment variables template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts                  # Tailwind with orange theme
├── tsconfig.json
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette (Orange Theme)

- **Primary**: Orange (#f97316)
- **Gradients**: Orange → Yellow → Orange
- **Accents**: Blue, Green, Purple for actions
- **Backgrounds**: Warm cream, soft pastels

### UI Components

- **Buttons**: Large (min 48px), rounded, with shadows
- **Cards**: Rounded corners (xl), soft shadows
- **Inputs**: Border focus states, orange accents
- **Spacing**: Generous padding, clear hierarchy

### Responsive Design

- Mobile-first approach
- Touch-friendly buttons
- Adaptive grid layouts
- Collapsible navigation

## 🔌 API Endpoints

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

### POST /api/upload-manual
Upload a manual video.

**Request**: `multipart/form-data`
- `video`: Video file
- `name`: Character name
- `script`: Script/description
- `thumbnail`: (optional) Thumbnail image

**Response**:
```json
{
  "success": true,
  "video": {
    "id": "123456789",
    "name": "Character Name",
    "videoUrl": "/uploads/videos/video-123456789.mp4",
    ...
  }
}
```

### GET /api/upload-manual
Get all manual videos.

**Response**:
```json
{
  "success": true,
  "videos": [...]
}
```

### DELETE /api/upload-manual?id=xxx
Delete a manual video.

## 🎭 Character Templates

8 pre-made templates available:

1. **Happy Kid** (😊) - Cheerful child character
2. **Cool Kid** (😎) - Confident kid
3. **Friendly Teen** (🎓) - Smart teenager
4. **Sporty Teen** (⚽) - Athletic teen
5. **Professional** (💼) - Capable adult
6. **Creative Artist** (🎨) - Artistic character
7. **Clever Cat** (🐱) - Smart cat
8. **Loyal Dog** (🐶) - Friendly dog

## ⚡ Performance

- **Character Creation**: 30-60 seconds
- **Video Generation**: 1-2 minutes
- **Max Image Size**: 10MB
- **Max Script Length**: 500 characters
- **Video Format**: MP4
- **Video Length**: ~30 seconds

## 🐛 Troubleshooting

### "API key not configured" error
- Verify `.env` file exists in root directory
- Check API keys are set correctly
- Restart the development server

### Character creation fails
- Check image file size (< 10MB)
- Use clear, well-lit photos
- Verify Replicate API has credits

### Video generation fails
- Verify D-ID API has credits
- Check character image URL is accessible
- Ensure script is under 500 characters

### Build errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Manual upload not working
- Ensure upload directories exist:
  ```bash
  mkdir -p public/uploads/videos public/uploads/thumbnails
  ```
- Check file permissions
- Verify video file size (< 50MB)

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🔒 Security Notes

- API keys stored server-side only
- Never expose keys in client code
- `.env` file gitignored by default
- File uploads validated (type, size)
- No authentication required (MVP)

## 🎓 Educational Use Cases

- **Teachers**: Create engaging educational content
- **Parents**: Make storytelling interactive
- **Students**: Present projects creatively
- **Content Creators**: Generate unique videos quickly

## 📝 Future Enhancements

- [ ] User authentication
- [ ] Video gallery/history
- [ ] Multiple voice options
- [ ] Custom character styles
- [ ] Batch video processing
- [ ] Advanced editing features
- [ ] Social media integration
- [ ] Character animation customization
- [ ] Longer video support
- [ ] Multiple language support

## 📜 License

This project is for educational and demonstration purposes.

## 🤝 Credits

- Character generation powered by [Replicate](https://replicate.com/)
- Video generation powered by [D-ID](https://www.d-id.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 💬 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the API documentation:
   - [Replicate Docs](https://replicate.com/docs)
   - [D-ID API Docs](https://docs.d-id.com/)

---

Made with 🧡 for parents, teachers, and storytellers
