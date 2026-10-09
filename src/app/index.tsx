import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';

// 👉 YAHAN APNI OPENWEATHERMAP API KEY PASTE KAREIN
const API_KEY = 'e3a3967f651cfe4af4099314cb3be330';

interface WeatherData {
  cityName: string;
  country: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Enter your City name');
      return;
    }

    setLoading(true);
    setError('');
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        setError(data.message ? data.message.toUpperCase() : 'City not found');
        setWeather(null);
        return;
      }

      setWeather({
        cityName: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      setError('Failed to fetch data! Please check your internet connection.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>

      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter your city name  (e.g. Mumbai)"
          placeholderTextColor="#888"
          value={city}
          onChangeText={setCity}
          returnKeyType="search"
          onSubmitEditing={fetchWeather}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Weather Result Card */}
      {weather && !loading && (
        <View style={styles.card}>
          <Text style={styles.cityName}>
            {weather.cityName}, {weather.country}
          </Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
            style={styles.weatherIcon}
            accessibilityLabel={weather.description}
          />
          <Text style={styles.temperature}>{weather.temp}°C</Text>
          <Text style={styles.condition}>{weather.description}</Text>
          <Text style={styles.detail}>Humidity: {weather.humidity}%</Text>
          <Text style={styles.detail}>Wind: {weather.windSpeed} m/s</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#f4f7fb',
  },
  title: {
    marginBottom: 24,
    color: '#14213d',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccd5e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#14213d',
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    marginTop: 24,
  },
  errorText: {
    marginTop: 20,
    color: '#b42318',
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    marginTop: 28,
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  cityName: {
    color: '#14213d',
    fontSize: 22,
    fontWeight: '700',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    color: '#14213d',
    fontSize: 48,
    fontWeight: '700',
  },
  condition: {
    marginBottom: 16,
    color: '#526173',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  detail: {
    marginTop: 4,
    color: '#526173',
    fontSize: 15,
  },
});
