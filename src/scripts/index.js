import { GaugeIndicator } from '../components/gauge-indicator.js';
import { forecastCard } from '../components/forecast-card.js';

class weatherApp {
    selectors = {
        root: '[data-js]',
        aside: '[data-js-aside]',
        weather: '[data-js-weather]',
        search: '[data-js-search]',
        img: '[data-js-img]',
        location: '[data-js-location]',
        temp: '[data-js-temp]',
        dateTime: '[data-js-date-time]',
        desc: '[data-js-desc]',
        hum: '[data-js-humidity]',
        feel: '[data-js-feels-like]',
        wind: '[data-js-wind]',
        temp: '[data-js-temp]',
        forecast: '[data-js-forecast]',
        graphWrapper: '[data-js-graph-wrapper]',
        airQuality: '[data-js-air-quality]',
        uvIndex: '[data-js-uv-index]',
        suggestions: '[data-js-suggestions]'
    };

    apiKey = 'f03eba2e18d64401b84150205260402';
    apiUrl = 'http://api.weatherapi.com/v1/forecast.json';
    apiUrlSearch = 'http://api.weatherapi.com/v1/search.json'
    apiUrlForecast = 'http://api.weatherapi.com/v1/forecast.json'
    dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    timeOfday = "day"

    constructor() {
        this.root = document.querySelector(this.selectors.root);

        this.aside = this.root.querySelector(this.selectors.aside);
        this.search = this.aside.querySelector(this.selectors.search);
        this.suggestions = this.aside.querySelector(this.selectors.suggestions);
        this.img = this.aside.querySelector(this.selectors.img);
        this.location = this.aside.querySelector(this.selectors.location);
        this.temp = this.aside.querySelector(this.selectors.temp);
        this.dateTime = this.aside.querySelector(this.selectors.dateTime);
        this.forecast = this.aside.querySelector(this.selectors.forecast);
        this.graphWrapper = this.aside.querySelector(this.selectors.graphWrapper);
        this.airQuality = this.aside.querySelector(this.selectors.airQuality);
        this.uvIndex = this.aside.querySelector(this.selectors.uvIndex);

        this.weather = this.root.querySelector(this.selectors.weather);

        this.bindEvents();
        this.updateClock()

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

    debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    onInput(event) {
        const value = event.target.value.trim();

        if (value) {
            this.fetchWeather(value);
            this.fetchCity(value);
        }
    }

    onBlur() {
        this.fetchWeather(this.search.value);
    }

    formateDate(date) {
        const dateObject = new Date(date)
        const dayName = this.dayNames[dateObject.getDay()];
        const monthName = this.monthNames[dateObject.getMonth()];
        const dayNumber = dateObject.getDate();

        return `${dayName}, ${monthName} ${dayNumber}`;
    }

    updateClock(date) {
        const now = new Date(date);
        const hours = String(now.getHours()).padStart(2, '0');
        this.hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const day = this.dayNames[now.getDay()]

        this.dateTime.textContent = `${day}, ${hours}:${minutes}`;
    }


    setMainIcon(code) {
        console.log(code)
        this.img.setAttribute('src', `icons/${this.timeOfday}/${code}.png`)
    }

    setForecastNextTwoDays(forecastday) {
        const dayEls = this.forecast.querySelectorAll('[data-js-day]')
        dayEls.forEach((i, j) => {
            let { code, text } = forecastday[j + 1].day.condition;
            let { date } = forecastday[j + 1]
            i.children[0].setAttribute('src', `icons/${this.timeOfday}/${code}.png`);
            i.children[1].textContent = this.formateDate(date);
            i.children[2].textContent = text;
        })
    }

    updateAttrs(el, hour) {
        const attrs = {
            time: hour.time.split(' ')[1],
            code: hour.condition.code,
            temp_c: hour.temp_c,
            is_day: hour.is_day
        };
        for (const [key, value] of Object.entries(attrs)) {
            el.setAttribute(key, value);
        }
        return el;
    }

    createEl(hour) {
        const el = document.createElement('forecast-card');
        this.updateAttrs(el, hour);
        return el;
    }

    renderForecastCards(forecastday) {
        const hoursArray = [];
        const start = this.hours - 1;
        const totalHours = forecastday[0].hour;
        let i = 0;

        for (let i = 0; i <= 24; i++) {
            const index = (start + i + 24) % 24;
            hoursArray.push(totalHours[index]);
        }

        if (this.weather.children.length >= 24) {
            for (let el of this.weather.children) {
                this.updateAttrs(el, hoursArray[i++]);
            }
        } else {
            hoursArray.forEach((hour) => {
                this.weather.append(this.createEl(hour));
            });
        }
    }

    bindEvents() {
        this.search.addEventListener('input', this.debounce(this.onInput.bind(this), 500));
        this.search.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.fetchWeather(this.search.value.trim());
            }
        });
    }

    createSuggestionLi(city) {
        const li = document.createElement('li');

        li.innerHTML = `
            <p>${city.name}</p>
            <div>
                <span class="region">${city.region}</span>
                <span class="country">${city.country}</span>
            </div>
        `

        return li;
    }

    fetchCity(q) {
        const url = `${this.apiUrlSearch}?key=${this.apiKey}&q=${q}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.forEach((city) => {
                    console.log(this.createSuggestionLi(city));
                    this.suggestions.append(this.createSuggestionLi(city));
                })
            })

    }

    fetchWeather(q) {
        const url = `${this.apiUrl}?key=${this.apiKey}&q=${q}&aqi=yes&days=3`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { code } = data.current.condition;
                const { location } = data
                const { forecastday } = data.forecast

                console.log(data);
                this.timeOfday = data.current.is_day ? "day" : "night";
                this.setMainIcon(code);
                this.location.textContent = `${location.name}, ${location.country}`;
                this.temp.textContent = data.current.temp_c;
                this.updateClock(location.localtime);
                this.setForecastNextTwoDays(forecastday);
                this.renderForecastCards(forecastday);
                this.airQuality.setAttribute('value', data.current.air_quality["us-epa-index"]);
                this.uvIndex.setAttribute('value', data.current.uv);

            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}

const WeatherApp = new weatherApp();
// this.temp.textContent = `${Math.round(data.main.temp)}°C (Feels like: ${Math.round(data.main.feels_like)}°C)`;
