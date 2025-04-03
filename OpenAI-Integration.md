# OpenAI Integration for Bird Identification

This document explains how BirdScout uses OpenAI's GPT-4o Vision model to identify birds from images.

## Setup Instructions

1. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

2. Install required dependencies:
   ```bash
   npm install openai expo-file-system react-native-dotenv @react-native-async-storage/async-storage
   ```

3. Make sure your `babel.config.js` is configured to use environment variables (already done in this project).


## Troubleshooting

- If you're getting authentication errors, ensure your OpenAI API key is correct in the `.env` file.
- For image processing issues, check that `expo-file-system` is correctly installed and the base64 encoding is working.
- If the model returns low confidence identifications, try taking clearer photos with better lighting and the bird as the main subject.
- If images aren't being saved properly, check that your app has proper storage permissions.

## Credits

This integration uses:
- [OpenAI API](https://openai.com/blog/openai-api)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Native dotenv](https://github.com/goatandsheep/react-native-dotenv) 