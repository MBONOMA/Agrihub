import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { DatabaseProvider, ModelProvider, LanguageProvider } from '../src/context';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <LanguageProvider>
        <DatabaseProvider>
          <ModelProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTintColor: Colors.textLight,
              headerTitleStyle: {
                fontWeight: '600',
              },
              contentStyle: {
                backgroundColor: Colors.background,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="scan/camera"
              options={{
                title: 'Scan Leaf',
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen
              name="scan/results"
              options={{
                title: 'Analysis Results',
              }}
            />
            <Stack.Screen
              name="details/crop/[id]"
              options={{
                title: 'Crop Details',
              }}
            />
            <Stack.Screen
              name="details/disease/[id]"
              options={{
                title: 'Disease Details',
              }}
            />
          </Stack>
        </ModelProvider>
      </DatabaseProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
