import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import * as Location from 'expo-location';

import DateTime from './components/DateTime';
import WeatherScroll from './components/WeatherScroll';
const API_KEY = "9950e5c4b25f96450080aedd391da0fd";
const img = require('./assets/image.png')
export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchDataFromApi("40.7128", "-74.0060")
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchDataFromApi(location.coords.latitude, location.coords.longitude);
    })();
  }, [])

  const fetchDataFromApi = (latitude, longitude) => {
    if (latitude && longitude) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log('The data is..!!', data)
        setData(data)
      })
    }

  }

  return (
    <View style={styles.container}>
      <ImageBackground source={img} style={styles.image} >
        <DateTime current={data.current} timezone={data.timezone} lat={data.lat} lon={data.lon} />
        <WeatherScroll weatherData={data.daily} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  }
});
