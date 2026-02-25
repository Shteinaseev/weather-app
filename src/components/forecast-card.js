export class forecastCard extends HTMLElement {

    static observedAttributes = ['time', 'code', 'temp_c'];

    time = this.getAttribute('time');
    code = this.getAttribute('code');
    temp_c = this.getAttribute('temp_c');

    constructor() {
        super();

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'time') this.time = newValue;
        if (name === 'code') this.code = Number(newValue);
        if (name === 'temp_c') this.temp_c = Number(newValue);
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                .card-logo {
                    max-width: 3.5rem;
                    max-height: 2.5rem;
                }
            </style>
            <p class="time">
                ${this.time}
            </p>
            <img src="./icons/day/${this.code}.png" alt="" class="card-logo">
            <p class="temp">${this.temp_c}</p>
        `
    }

}

customElements.define("forecast-card", forecastCard); 
