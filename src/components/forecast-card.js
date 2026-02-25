export class forecastCard extends HTMLElement {

    static observedAttributes = ['time', 'code', 'temp_c', 'is_day'];

    time = this.getAttribute('time');
    code = this.getAttribute('code');
    temp_c = this.getAttribute('temp_c');
    timeOfday = Number(this.getAttribute('is_day')) ? "day" : "night";

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'time') this.time = newValue;
        if (name === 'code') this.code = Number(newValue);
        if (name === 'temp_c') this.temp_c = Number(newValue);
        if (name === 'is_day') this.timeOfday = Number(newValue) ? "day" : "night";

        this.render();
    }

    render() {
        this.innerHTML = `
            <p class="time">
                ${this.time}
            </p>
            <img src="./icons/${this.timeOfday}/${this.code}.png" alt="" class="card-logo">
            <p class="temp">${this.temp_c}°C</p>
            
        `
    }

    connectedCallback() {
        this.render();
    }

}

customElements.define("forecast-card", forecastCard); 
