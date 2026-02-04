
class weatherApp {
    selectors = {
        root: '[data-js]',
        result: '[data-js-result]',
        temp: '[data-js-temp]',
        city: '[data-js-city]',
        desc: '[data-js-desc]',
        hum: '[data-js-humidity]',
        feel: '[data-js-feels-like]',
        wind: '[data-js-wind]',
        temp: '[data-js-temp]',
    };

    apiKey = 'f03eba2e18d64401b84150205260402';
    apiUrl = 'http://api.weatherapi.com/v1/current.json';

    constructor() {
        this.root = document.querySelector(this.selectors.root);
        this.result = this.root.querySelector(this.selectors.result);
        this.temp = this.root.querySelector(this.selectors.temp);
        this.feel = this.root.querySelector(this.selectors.feel);
        this.wind = this.root.querySelector(this.selectors.wind);
        this.city = this.root.querySelector(this.selectors.city);
        this.desc = this.root.querySelector(this.selectors.desc);
        this.hum = this.root.querySelector(this.selectors.hum);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.fetchWeather(`${position.coords.latitude}, ${position.coords.longitude}`);
            },
            (error) => {
                console.warn("Geolocation blocked or failed.");
                this.fetchWeather('auto:ip');
            }
        );
    }

    fetchWeather(q) {
        const url = `${this.apiUrl}?key=${this.apiKey}&q=${q}&aqi=no`;

        fetch(url)
            .then(response => response.json())
            .then(data => {

                this.city.textContent = `${data.location.name}, ${data.location.country}`;
                this.temp.textContent = `${Math.round(data.current.temp_c)}°C`;
                this.desc.textContent = data.current.condition.text;
                this.hum.textContent = `Humidity: ${data.current.humidity}%`;

                this.feel.textContent = `${Math.round(data.current.feelslike_c)}°C`;
                this.wind.textContent = `Wind: ${data.current.wind_kph} km/h`;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}

const WeatherApp = new weatherApp();
// this.temp.textContent = `${Math.round(data.main.temp)}°C (Feels like: ${Math.round(data.main.feels_like)}°C)`;
