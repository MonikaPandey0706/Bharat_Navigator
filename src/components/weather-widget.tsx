"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSun, Thermometer } from "lucide-react";

const weatherIcons = {
  Sunny: <Sun className="h-6 w-6 text-yellow-500" />,
  "Partly Cloudy": <CloudSun className="h-6 w-6 text-gray-500" />,
  Cloudy: <Cloud className="h-6 w-6 text-gray-400" />,
  Rainy: <CloudRain className="h-6 w-6 text-blue-500" />,
};

type WeatherType = keyof typeof weatherIcons;

interface WeatherWidgetProps {
    city: string;
}

// Mock data fetching
const getMockWeather = (city: string) => {
    const weatherTypes: WeatherType[] = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"];
    const today = new Date();
    const currentTemp = Math.floor(Math.random() * 15) + 20; // 20-34 C
    const currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    const forecast = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i + 1);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.floor(Math.random() * 10) + (currentTemp - 5),
            weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        };
    });

    return { currentTemp, currentWeather, forecast };
};

export default function WeatherWidget({ city }: WeatherWidgetProps) {
    const [weatherData, setWeatherData] = useState<{
        currentTemp: number;
        currentWeather: WeatherType;
        forecast: { day: string; temp: number; weather: WeatherType }[];
    } | null>(null);

    useEffect(() => {
        // Simulating API call
        setWeatherData(getMockWeather(city));
    }, [city]);

    if (!weatherData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Thermometer className="text-primary" /> Weather
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading weather...</p>
                </CardContent>
            </Card>
        );
    }

    const { currentTemp, currentWeather, forecast } = weatherData;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                    <Thermometer className="text-primary" /> Weather in {city}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                        <p className="text-4xl font-bold">{currentTemp}°C</p>
                        <p className="text-muted-foreground">{currentWeather}</p>
                    </div>
                    <div>{weatherIcons[currentWeather]}</div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">5-Day Forecast</h3>
                    <div className="space-y-2">
                        {forecast.map((day) => (
                            <div key={day.day} className="flex justify-between items-center text-sm">
                                <p className="w-1/3 text-muted-foreground">{day.day}</p>
                                <div className="w-1/3 flex justify-center">
                                    {weatherIcons[day.weather]}
                                </div>
                                <p className="w-1/3 text-right font-medium">{day.temp}°C</p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
