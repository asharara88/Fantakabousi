# Biowell Digital Wellness Coach

A comprehensive AI-powered wellness platform for personalized health optimization, biometric tracking, and supplement recommendations.

## 🚀 Features

- **AI Wellness Coach**: Personalized health guidance and recommendations
- **Real-time Health Tracking**: Biometric monitoring and trend analysis
- **Supplement Stack**: AI-curated supplement recommendations
- **Nutrition Logging**: Food tracking with glucose impact analysis
- **Recipe Search**: Health-optimized meal recommendations
- **Profile Management**: Comprehensive health profile and preferences

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **APIs**: OpenAI, ElevenLabs, Spoonacular
- **Deployment**: Netlify

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard and main app components
│   ├── layout/         # Layout components
│   ├── nutrition/      # Food logging components
│   ├── recipes/        # Recipe search components
│   ├── supplements/    # Supplement components
│   └── ui/            # Reusable UI components
├── contexts/           # React contexts
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
└── styles/            # Global styles
```

## 🎨 Design System

- **Colors**: Biowell brand colors (#48C6FF, #2A7FFF, #0026CC)
- **Typography**: Inter font family with 6 weight variations
- **Spacing**: 8px base grid system
- **Components**: Unified design tokens and variants

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- GDPR-compliant data handling
- Secure API key management
- User data encryption

## 📱 Responsive Design

- Mobile-first approach
- Touch-optimized interactions
- Progressive Web App (PWA) ready
- Accessibility compliant (WCAG 2.1)

## 🚀 Deployment

The app is configured for deployment on Netlify with automatic builds from the main branch.

## 📄 License

Private - All rights reserved