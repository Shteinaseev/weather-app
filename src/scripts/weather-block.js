export class WeatherBlock {
    count = 25;
    angle = 340 / this.count;
    radius = 1250;
    currentAngle = 0;
    isDragging = false;
    startX = 0;
    prevX = 0;
    velocity = 0;

    constructor(el, forecastObj, hours) {
        this.weather = el;
        this.forecastday = forecastObj;
        this.hours = hours;
        this.weather.style.transform = `rotateY(${this.getMinimalAngle()}deg)`;
        this.renderForecastCards(this.forecastday);
        if (window.innerWidth > 700) {
            this.bindEvents();
        }
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
            hoursArray.forEach((hour, i) => {
                const el = this.createEl(hour)
                this.weather.append(el);
                if (window.innerWidth > 700) {
                    const rot = i * this.angle;
                    el.style.transform = `rotateY(-${rot}deg) translateZ(-${this.radius}px)`;
                }
            });
        }
    }

    updateRotation() {
        this.weather.style.transform = `rotateY(${this.currentAngle}deg)`;
    }

    onDown(e) {
        console.log("asfdgsdh")
        this.isDragging = true;
        this.startX = this.prevX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        this.velocity = 0;
        e.preventDefault();
    }

    getMinimalAngle() {
        const w = this.weather.parentElement?.offsetWidth || 1000;

        // Определяем "желаемую" долю от ширины в зависимости от размера экрана
        let targetFraction;
        if (w <= 450) {
            targetFraction = 0.35;
        } else if (w <= 550) {
            targetFraction = 0.4;
        } else if (w <= 800) {
            targetFraction = 0.45;
        } else if (w <= 900) {
            targetFraction = 0.5;
        } else if (w <= 1200) {
            targetFraction = 0.55;
        } else {
            targetFraction = 0.35;
        }

        const offsetPx = w * targetFraction;
        const rad = Math.asin(Math.min(1, offsetPx / this.radius));  // защита от >90°
        return rad * (180 / Math.PI);
    }

    getMaxAngle() {
        const baseMax = (this.count - 1) * this.angle;   // 326.4°

        const w = this.weather.parentElement?.offsetWidth || 1200;

        // На широких экранах уменьшаем максимальный поворот
        let reduction = 10;

        if (w >= 1200) reduction = 45;
        else if (w >= 900) reduction = 35;
        else if (w >= 800) reduction = 28;
        else if (w >= 750) reduction = 24;
        else if (w >= 650) reduction = 20;
        else if (w >= 550) reduction = 16;
        else if (w <= 350) reduction = 8;
        const maxAngle = baseMax - reduction;

        // Не даём упасть слишком низко
        return Math.max(240, maxAngle);
    }

    onMove(e) {
        if (!this.isDragging) return;

        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const delta = x - this.prevX;

        this.velocity = delta * -0.1;
        this.currentAngle += this.velocity;

        this.currentAngle = Math.max(this.getMinimalAngle(), Math.min(this.currentAngle, this.getMaxAngle()));
        console.log(this.getMinimalAngle(), this.getMaxAngle())
        this.updateRotation();

        this.prevX = x;
    }

    onUp() {
        if (!this.isDragging) return;
        this.isDragging = false;

        function inertia() {
            if (Math.abs(this.velocity) < 1.5) return;

            this.currentAngle += this.velocity;

            // Ограничение ротации между первым и последним элементом
            this.currentAngle = Math.max(this.getMinimalAngle(), Math.min(this.currentAngle, this.getMaxAngle()));

            this.velocity *= 0.6; // Замедление
            this.updateRotation();
            requestAnimationFrame(inertia.bind(this));
        }

        requestAnimationFrame(inertia.bind(this));
    }

    bindEvents() {
        this.weather.addEventListener('mousedown', this.onDown.bind(this));
        this.weather.addEventListener('touchstart', this.onDown.bind(this), { passive: false });

        window.addEventListener('mousemove', this.onMove.bind(this));
        window.addEventListener('touchmove', this.onMove.bind(this), { passive: false });

        window.addEventListener('mouseup', this.onUp.bind(this));
        window.addEventListener('touchend', this.onUp.bind(this));

    }

}