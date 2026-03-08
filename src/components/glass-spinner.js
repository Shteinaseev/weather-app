import styles from './glass-spinner.css?inline';

export class GlassSpinner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    show() {
        this.classList.remove('hidden');
    }

    hide() {
        this.classList.add('hidden');
        setTimeout(() => {
            this.remove();
        }, 800);
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            <div class="glass-wrapper">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>
                <div class="glass-content">
                    <div class="spinner-ring"></div>
                    <div class="spinner-core"></div>
                </div>
            </div>

        `

        document.addEventListener('weather-fetch-start', () => {
            this.show();
        });

        document.addEventListener('weather-fetch-end', () => {
            this.hide();
        });
    }

}
customElements.define("glass-spinner", GlassSpinner); 
