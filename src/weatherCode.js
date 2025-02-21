export class weatherCode {
    constructor() {
        this.weatherCodes = {
            0: {
                description: 'Clear',
                image: {
                    day: '/images/sun.png',
                    night: '/images/nightclear.png',
                }
            },
            1: {
                description: 'Mainly clear',
                image: {
                    day: '/images/cloudy.png',
                    night: '/images/nightcloud.png',
                }
            },
            2: {
                description: 'Partly cloudy',
                image: {
                    day: '/images/cloudy.png',
                    night: '/images/nightcloud.png',
                }
            },
            3: {
                description: 'Overcast',
                image: {
                    day: '/images/cloud.png',
                    night: '/images/cloud.png',
                }
            },
            45: {
                description: 'Fog',
                image: {
                    day: '/images/fog.png',
                    night: '/images/fog.png',
                }
            },
            48: {
                description: 'Freezing fog',
                image: {
                    day: '/images/fog.png',
                    night: '/images/fog.png',
                }
            },
            51: {
                description: 'Light drizzle',
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            53: {
                description: 'Moderate drizzle',
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            55: {
                description: 'Dense drizzle',
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            56: {
                description: 'Freezing drizzle',
                image: {
                    day: '/images/hail.png',
                    night: '/images/hail.png',
                }
            },
            57: {
                description: 'Freezing drizzle',
                image: {
                    day: '/images/hail.png',
                    night: '/images/hail.png',
                }
            },
            61: {
                description: 'Slight rain',
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            63: {
                description: 'Moderate rain',
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            65: {
                description: 'Heavy rain',
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            66: {
                description: 'Freezing Rain', //light
                image: {
                    day: '/images/hail.png',
                    night: '/images/hail.png',
                }
            },
            67: {
                description: 'Freezing rain', //heavy
                image: {
                    day: '/images/hail.png',
                    night: '/images/hail.png',
                }
            },
            71: {
                description: 'Light snow',
                image: {
                    day: '/images/day-snow.png',
                    night: '/images/nightsnow.png',
                }
            },
            73: {
                description: 'Moderate snow',
                image: {
                    day: '/images/snowflake.png',
                    night: '/images/snowflake.png',
                }
            },
            75: {
                description: 'Heavy snow',
                image: {
                    day: '/images/snowflake.png',
                    night: '/images/snowflake.png',
                }
            },
            77: {
                description: 'Snow flurries',
                image: {
                    day: '/images/snowflake.png',
                    night: '/images/snowflake.png',
                }
            },
            80: {
                description: 'Rain showers', //light
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            81: {
                description: 'Rain showers', //moderate
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            82: {
                description: 'Rain showers', //heavy
                image: {
                    day: '/images/rainy.png',
                    night: '/images/rainy.png',
                }
            },
            85: {
                description: 'Snow showers', //light
                image: {
                    day: '/images/snowflake.png',
                    night: '/images/snowflake.png',
                }
            },
            86: {
                description: 'Snow showers', //heavy
                image: {
                    day: '/images/snowflake.png',
                    night: '/images/snowflake.png',
                }
            },
            95: {
                description: 'Thunderstorm',
                image: {
                    day: '/images/storm.png',
                    night: '/images/storm.png',
                }
            },
            96: {
                description: 'Thunderstorm (Hail)', //light
                image: {
                    day: '/images/stormhail.png',
                    night: '/images/stormhail.png',
                }
            },
            99: {
                description: 'Thunderstorm (Hail)', //heavy
                image: {
                    day: '/images/stormhail.png',
                    night: '/images/stormhail.png',
                }
            }
        }
    }

    getWeatherCode(value) {
        return this.weatherCodes[value];
    }
}