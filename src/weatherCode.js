const prodPrefix = process.env.NODE_ENV === 'production' ? '/my-next-weather-app' : '';

export class weatherCode {
    constructor() {
        this.weatherCodes = {
            0: {
                description: 'Clear',
                image: {
                    day: prodPrefix + '/images/sun.png',
                    night: prodPrefix + '/images/nightclear.png',
                }
            },
            1: {
                description: 'Mainly clear',
                image: {
                    day: prodPrefix + '/images/cloudy.png',
                    night: prodPrefix + '/images/nightcloud.png',
                }
            },
            2: {
                description: 'Partly cloudy',
                image: {
                    day: prodPrefix + '/images/cloudy.png',
                    night: prodPrefix + '/images/nightcloud.png',
                }
            },
            3: {
                description: 'Overcast',
                image: {
                    day: prodPrefix + '/images/cloud.png',
                    night: prodPrefix + '/images/cloud.png',
                }
            },
            45: {
                description: 'Fog',
                image: {
                    day: prodPrefix + '/images/fog.png',
                    night: prodPrefix + '/images/fog.png',
                }
            },
            48: {
                description: 'Freezing fog',
                image: {
                    day: prodPrefix + '/images/fog.png',
                    night: prodPrefix + '/images/fog.png',
                }
            },
            51: {
                description: 'Light drizzle',
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            53: {
                description: 'Moderate drizzle',
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            55: {
                description: 'Dense drizzle',
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            56: {
                description: 'Freezing drizzle',
                image: {
                    day: prodPrefix + '/images/hail.png',
                    night: prodPrefix + '/images/hail.png',
                }
            },
            57: {
                description: 'Freezing drizzle',
                image: {
                    day: prodPrefix + '/images/hail.png',
                    night: prodPrefix + '/images/hail.png',
                }
            },
            61: {
                description: 'Slight rain',
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            63: {
                description: 'Moderate rain',
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            65: {
                description: 'Heavy rain',
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            66: {
                description: 'Freezing Rain', //light
                image: {
                    day: prodPrefix + '/images/hail.png',
                    night: prodPrefix + '/images/hail.png',
                }
            },
            67: {
                description: 'Freezing rain', //heavy
                image: {
                    day: prodPrefix + '/images/hail.png',
                    night: prodPrefix + '/images/hail.png',
                }
            },
            71: {
                description: 'Light snow',
                image: {
                    day: prodPrefix + '/images/day-snow.png',
                    night: prodPrefix + '/images/nightsnow.png',
                }
            },
            73: {
                description: 'Moderate snow',
                image: {
                    day: prodPrefix + '/images/snowflake.png',
                    night: prodPrefix + '/images/snowflake.png',
                }
            },
            75: {
                description: 'Heavy snow',
                image: {
                    day: prodPrefix + '/images/snowflake.png',
                    night: prodPrefix + '/images/snowflake.png',
                }
            },
            77: {
                description: 'Snow flurries',
                image: {
                    day: prodPrefix + '/images/snowflake.png',
                    night: prodPrefix + '/images/snowflake.png',
                }
            },
            80: {
                description: 'Rain showers', //light
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            81: {
                description: 'Rain showers', //moderate
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            82: {
                description: 'Rain showers', //heavy
                image: {
                    day: prodPrefix + '/images/rainy.png',
                    night: prodPrefix + '/images/rainy.png',
                }
            },
            85: {
                description: 'Snow showers', //light
                image: {
                    day: prodPrefix + '/images/snowflake.png',
                    night: prodPrefix + '/images/snowflake.png',
                }
            },
            86: {
                description: 'Snow showers', //heavy
                image: {
                    day: prodPrefix + '/images/snowflake.png',
                    night: prodPrefix + '/images/snowflake.png',
                }
            },
            95: {
                description: 'Thunderstorm',
                image: {
                    day: prodPrefix + '/images/storm.png',
                    night: prodPrefix + '/images/storm.png',
                }
            },
            96: {
                description: 'Thunderstorm (Hail)', //light
                image: {
                    day: prodPrefix + '/images/stormhail.png',
                    night: prodPrefix + '/images/stormhail.png',
                }
            },
            99: {
                description: 'Thunderstorm (Hail)', //heavy
                image: {
                    day: prodPrefix + '/images/stormhail.png',
                    night: prodPrefix + '/images/stormhail.png',
                }
            }
        }
    }

    getWeatherCode(value) {
        return this.weatherCodes[value];
    }
}