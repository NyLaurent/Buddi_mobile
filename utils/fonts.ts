import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Comfortaa-Regular': require('../assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Medium': require('../assets/fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-Bold': require('../assets/fonts/Comfortaa-Bold.ttf'),
  });
}; 