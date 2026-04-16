# Premed Journey

A React Native / Expo app for pre-medical students to track clinical, shadowing, and research experiences and draft medical school application essays with AI assistance.

## Features

- **Home** — Monthly progress bars (Clinical / Shadowing / Research), meaningful highlights, draft-in-progress banner
- **Timeline** — Filterable, month-grouped experience list with star toggle and delete; experience detail bottom sheet with edit support
- **Add / Edit Experience** — Type selector, date picker, multi-select skill tags, reflection fields
- **Essay Builder** — Prompt selector (5 built-in + custom prompts), experience checkbox picker, skills-covered cloud, Gemini-powered outline generation
- **Draft Viewer** — Copy to clipboard or save drafts; view past drafts from Essays tab

## Setup

```bash
git clone <repo-url>
cd premed-experience-app
npm install

# Add your Gemini API key
cp .env.example .env
# Edit .env and replace `your_key_here` with your actual key

npx expo start
```

Open in the Expo Go app or an iOS simulator.

## Environment Variables

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Gemini 2.5 Flash API key for essay outline generation |

Get a free key at [Google AI Studio](https://aistudio.google.com/).

## Tech Stack

- **Expo SDK 54** with Expo Router v6 (file-based routing)
- **React Native 0.81.5** / **React 19** — New Architecture enabled
- **TypeScript 5.9**
- **AsyncStorage** — local persistence for experiences, prompts, and drafts
- **phosphor-react-native** — icons
- **expo-haptics** — haptic feedback throughout
- **expo-clipboard** — copy outline to clipboard
- **@react-native-community/datetimepicker** — date picker in Add Experience
- **DM Serif Display + DM Sans** — typography
