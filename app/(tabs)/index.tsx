import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, StyleSheet, Dimensions } from 'react-native';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AdMobBanner } from 'expo-ads-admob';
import AnalogClock from '../../components/AnalogClock';

// Definir las tareas con duración en segundos
const tasks = [
  { name: "Brush your teeth", duration: 18, image: require('../../assets/images/teeth.png'), color: '#DCF3DF' },
  { name: "Get dressed", duration: 300, image: require('../../assets/images/clothes.png'), color: '#FFD1DC' },
  { name: "Tidy your room", duration: 600, image: require('../../assets/images/clean.webp'), color: '#FFB3BA' },
  { name: "Reading time", duration: 1200, image: require('../../assets/images/book.png'), color: '#FFEB99' },
  { name: "Breakfast before school", duration: 1200, image: require('../../assets/images/breakfast.webp'), color: '#A7D8E0' },
  { name: "Bath time", duration: 900, image: require('../../assets/images/bath.png'), color: '#A2C8E1' }
];

const Stack = createStackNavigator();

// Pantalla principal con la lista de tareas
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      {tasks.map((task, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.taskButton, { backgroundColor: task.color }]}
          onPress={() => navigation.navigate('Timer', { task })}
        >
          <Image source={task.image} style={styles.taskImage} />
          <View style={styles.taskTextWrapper}>
            <Text style={styles.taskText}>{task.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
    {/* Banner de prueba */}
    {/* <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111'} // ID de prueba
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Para cumplir con las políticas de privacidad
        }}
        onAdLoaded={() => console.log('Ad loaded')}
        onAdFailedToLoad={(error) => console.log('Ad failed to load', error)}
      /> */}
    </View>
  );
};

const { width } = Dimensions.get('window');
const clockSize = width * 0.8; 
// Pantalla del temporizador
const TimerScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [running, setRunning] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false); // Control para mostrar la cuenta atrás
  const [countdown, setCountdown] = useState(10); // Para la cuenta atrás de los últimos 10 segundos
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    let timer;
    if (running && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setRunning(false);
      setShowCountdown(true); // Mostrar la cuenta atrás cuando termine el tiempo
    }
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.5, duration: 500, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    }
  }, [running]);

  // Lógica para la cuenta atrás de los últimos 10 segundos
  useEffect(() => {
    let countdownTimer;
    if (showCountdown && countdown > 0) {
      countdownTimer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(countdownTimer);
  }, [showCountdown, countdown]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Volver</Text>
      </TouchableOpacity>
      <Text style={styles.taskTitle}>{task.name}</Text>

      {/* Si quedan más de 10 segundos, mostramos el reloj analógico */}
      {!showCountdown && <AnalogClock timeLeft={timeLeft} task={task} />}

      {/* Si quedan 10 segundos o menos, mostramos la cuenta atrás */}
      {showCountdown && (
        <Text style={styles.countdownText}>{countdown}</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setRunning(!running)}>
          <Text style={styles.buttonText}>{running ? "Pausa" : "Iniciar"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => { setRunning(false); setTimeLeft(task.duration); }}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Exportamos el componente con los navegadores
export default function App() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Timer" component={TimerScreen} />
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4da',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6A0572',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  taskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    width: '85%',
    height: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  taskImage: {
    width: 45,
    height: 45,
    marginRight: 15,
    resizeMode: 'contain',
  },
  taskTextWrapper: {
    position: 'absolute',
    left: 60,
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#6A0572',
    padding: 10,
    borderRadius: 10,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6A0572',
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: '#6A0572',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

// Registra el componente principal
AppRegistry.registerComponent('KiddyTime', () => App);