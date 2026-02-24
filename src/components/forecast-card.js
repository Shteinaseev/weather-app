export class forecastCard extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <p class="time"></p>
            <img src="" alt="" class="card-logo">
            <p class="temp"></p>
        `
    }

}

customElements.define("forecast-card", forecastCard); 
