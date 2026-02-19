
class weatherApp {
    selectors = {
        root: '[data-js]',
        aside: '[data-js-aside]',
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
        forecast: '[date-js-forecast]'
    };

    apiKey = 'f03eba2e18d64401b84150205260402';
    apiUrl = 'http://api.weatherapi.com/v1/forecast.json';
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
        this.img = this.aside.querySelector(this.selectors.img);
        this.location = this.aside.querySelector(this.selectors.location);
        this.temp = this.aside.querySelector(this.selectors.temp);
        this.dateTime = this.aside.querySelector(this.selectors.dateTime);
        this.forecast = this.aside.querySelector(this.selectors.forecast);


        this.bindEvents();
        this.updateClock()
        setInterval(this.updateClock.bind(this), 1000);

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
        console.log("dffds")
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    onInput(event) {
        const value = event.target.value.trim();
        if (value) {
            this.fetchWeather(value);
        }
    }

    onBlur() {
        this.fetchWeather(this.search.value);
        console.log("sd ", this.search.value)
    }

    formateDate(date) {
        const dateObject = new Date(date)
        const dayName = this.dayNames[dateObject.getDay()];
        const monthName = this.monthNames[dateObject.getMonth()];
        const dayNumber = dateObject.getDate();

        return `${dayName}, ${monthName} ${dayNumber}`;
    }

    updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const day = this.dayNames[now.getDay()]

        this.dateTime.textContent = `${day}, ${hours}:${minutes}`;
    }

    setMainIcon(code) {
        console.log(code)
        this.img.setAttribute('src', `icons/${this.timeOfday}/${code}.png`)
    }

    setForecastNextTwoDays(forecastday) {
        const dayEls = this.forecast.querySelectorAll('[date-js-day]')
        dayEls.forEach((i, j) => {
            let { code, text } = forecastday[j + 1].day.condition;
            let { date } = forecastday[j + 1]
            i.children[0].setAttribute('src', `icons/${this.timeOfday}/${code}.png`);
            i.children[1].textContent = this.formateDate(date);
            i.children[2].textContent = text;
        })
    }

    bindEvents() {
        this.search.addEventListener('blur', (event) => {
            this.onBlur(event)
        })
        this.search.addEventListener('input', this.debounce(this.onInput.bind(this), 500));
        this.search.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.fetchWeather(this.search.value.trim());
            }
        });
    }

    fetchWeather(q) {
        const url = `${this.apiUrl}?key=${this.apiKey}&q=${q}&aqi=no&days=3`;

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
                this.setForecastNextTwoDays(forecastday)
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}

const WeatherApp = new weatherApp();
// this.temp.textContent = `${Math.round(data.main.temp)}°C (Feels like: ${Math.round(data.main.feels_like)}°C)`;
