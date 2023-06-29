import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "fake api key";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("...Loading");

  const [days, setDays] = useState([]);

  const getWeather = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk(false);
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      setLocation({ latitude, longitude });
      const currLocation = await Location.reverseGeocodeAsync(
        { latitude, longitude },
        { useGoogleMaps: false }
      );
      setCity(
        currLocation[0].city ? currLocation[0].city : currLocation[0].region
      );

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`
      )
        .then((response) => response.json())
        .then((json) => {
          // console.log(json.daily);
          setDays(json.daily);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityname}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day - 273.15).toFixed(0)}°
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={34}
                  color="white"
                />
              </View>
              <Text style={styles.desc}>{day.weather[0].main}</Text>
              <Text style={styles.description}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityname: {
    fontSize: 60,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 40,
    alignItems: "flex-start",
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
    color: "white",
  },
  desc: {
    marginTop: -30,
    fontSize: 40,
    color: "white",
  },
  description: {
    color: "white",
  },
});
