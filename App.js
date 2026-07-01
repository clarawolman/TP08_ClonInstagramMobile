// ─────────────────────────────────────────────────────────────
// App.js — Punto de entrada de la aplicación
// Atribución IA (ver REFLEXION.md e HISTORIAL-IA.md):
//   · IA: armó el esqueleto NavigationContainer + StatusBar + el
//     manejo de la SplashScreen con preventAutoHideAsync/hideAsync.
//   · Yo: ajusté el timer de la splash a 1.5s y el "phoneContainer"
//     de 390px para que en web se vea con proporción de celular.
// ─────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

// Evita que la splash se oculte sola antes de que la app esté lista
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Mantengo la splash 1.5s y después la oculto
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.outerContainer}>
        <View style={styles.phoneContainer}>
          <NavigationContainer>
            {/* StatusBar oscura para contrastar con la cabecera blanca */}
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: isWeb ? '#1a1a1a' : '#fff',
    alignItems: isWeb ? 'center' : 'stretch',
    justifyContent: isWeb ? 'center' : 'flex-start',
  },
  phoneContainer: {
    flex: 1,
    width: isWeb ? 390 : '100%',
    maxWidth: isWeb ? 390 : undefined,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});
