import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const clockSize = width * 0.8;
const radius = clockSize / 2; // Radio del reloj, desde el centro al borde
const clockCenter = radius; // Centro del reloj

const AnalogClock = ({ timeLeft, task }) => {
  const [minuteAngle, setMinuteAngle] = useState(0); // Ángulo de la manecilla de minutos
  const [hourAngle, setHourAngle] = useState(0); // Ángulo de la manecilla de horas

  useEffect(() => {
    const totalMinutes = task.duration / 60; // duración total en minutos
    const elapsedMinutes = totalMinutes - (timeLeft / 60); // minutos transcurridos
    const minuteProgress = (elapsedMinutes / totalMinutes) * 360; // Manecilla de minutos avanza en 360 grados
    const hourProgress = (elapsedMinutes / (totalMinutes * 12)) * 360; // Manecilla de horas se mueve más lentamente (1 ciclo cada 12 horas)

    setMinuteAngle(minuteProgress); // Actualizamos el ángulo de la manecilla de minutos
    setHourAngle(hourProgress); // Actualizamos el ángulo de la manecilla de horas
  }, [timeLeft, task.duration]);

  // Función para calcular la posición de las agujas
  const getNeedlePosition = (angle, isMinuteHand = true) => {
    const radian = (angle * Math.PI) / 180;
    const length = isMinuteHand ? radius * 0.8 : radius * 0.6; // Manecilla de minutos más larga
    const x = clockCenter + length * Math.sin(radian); // Calculamos la posición X
    const y = clockCenter - length * Math.cos(radian); // Calculamos la posición Y
    return { x, y };
  };

  return (
    <View style={styles.container}>
      <View style={[styles.clock, { width: clockSize, height: clockSize }]}>
        {/* Fondo amarillo */}
        <View style={[styles.background, { width: clockSize, height: clockSize, backgroundColor: task.color }]}/>

        {/* Números del reloj */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
          const angle = (index * 30) - 90; // Calculamos la posición de cada número (en grados)
          const { x, y } = getNeedlePosition(angle, false);
          return (
            <Text
              key={index}
              style={[
                styles.number,
                { left: x - 10, top: y - 10 }
              ]}
            >
              {num}
            </Text>
          );
        })}

        {/* Manecilla de minutos */}
        <Animated.View
          style={[
            styles.minuteHand,
            {
              transform: [{ rotate: `${minuteAngle}deg` }],
            },
          ]}
        />
        
        {/* Manecilla de horas */}
        <Animated.View
          style={[
            styles.hourHand,
            {
              transform: [{ rotate: `${hourAngle}deg` }],
            },
          ]}
        />

      </View>

      {/* Texto de la cuenta atrás */}
      {timeLeft <= 10 && (
        <Text style={styles.countdownText}>{timeLeft}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  clock: {
    borderRadius: radius,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#000',
  },
  background: {
    position: 'absolute',
    borderRadius: radius,
    backgroundColor: '#FFEB99', // Fondo amarillo
    transform: [{ rotate: '0deg' }],
    zIndex: -1,
  },
  number: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  minuteHand: {
    position: 'absolute',
    width: 2,
    height: radius * 0.8,
    backgroundColor: 'black',
    top: clockCenter - radius * 0.8,
    left: clockCenter - 1,
    borderRadius: 2,
  },
  hourHand: {
    position: 'absolute',
    width: 3,
    height: radius * 0.6,
    backgroundColor: 'black',
    top: clockCenter - radius * 0.6,
    left: clockCenter - 1.5,
    borderRadius: 3,
  },
  countdownText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
  },
});

export default AnalogClock;