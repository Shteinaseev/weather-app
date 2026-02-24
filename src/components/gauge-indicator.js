import { getStatus } from '../config/statuses.js';
export class GaugeIndicator extends HTMLElement {
    viewWidth = Number(this.getAttribute('view-width')) || 200;
    viewHeight = Number(this.getAttribute('view-height')) || 100;
    title = this.getAttribute('title') || 'Air Quality'
    max = Number(this.getAttribute('max') || 5);
    value = Number(this.getAttribute('value') || 0);
    progress = this.value / this.max;

    cx = this.viewWidth / 2;
    cy = this.viewHeight * 0.9;
    radius = this.viewWidth * 0.4;
    arcLength = Math.PI * this.radius;
    strokeWidth = this.radius * 0.2;
    dotRadius = this.radius * 0.14;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                svg {
                    filter: drop-shadow(0rem 0rem 1rem #9874FF);

                    g {
                        transform-origin: center bottom;

                        transform: rotate(-30deg);
                    }

                    path {
                        stroke-linecap: round;
                    }

                }
            </style>
            <h3>Air Quality</h3>
            <svg viewBox="0 0 ${this.viewWidth} ${this.viewHeight}">
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#CDBBFF" />
                    <stop offset="10%" stop-color="#BFA3FF" />
                    <stop offset="20%" stop-color="#AC8EFF" />
                    <stop offset="30%" stop-color="#A07FFF" />
                    <stop offset="40%" stop-color="#9874FF" />
                    <stop offset="50%" stop-color="#9068FF" />
                    <stop offset="60%" stop-color="#865CFD" />
                    <stop offset="70%" stop-color="#7C4AFD" />
                    <stop offset="80%" stop-color="#713FFD" />
                    <stop offset="100%" stop-color="#5E2AFD" />
                </linearGradient>

                <path d="M ${this.cx - this.radius} ${this.cy} A ${this.radius} ${this.radius} 0 0 1 ${this.cx + this.radius} ${this.cy}" 
                stroke="#ffffff25" stroke-width="${this.strokeWidth}" fill="none" />

                <path id="progress" d="M ${this.cx - this.radius} ${this.cy} A ${this.radius} ${this.radius} 0 0 1 ${this.cx + this.radius} ${this.cy}"
                    stroke="url(#gradient)" stroke-width="${this.strokeWidth}" fill="none" stroke-dasharray="${this.arcLength}"
                    stroke-dashoffset="${this.arcLength * (1 - this.progress)}" />

                <g>
                    <circle class="needle" cx="${this.cx}" cy="${this.cy}" r="${this.dotRadius}" fill="#fff" />
                </g>
            </svg>
            <div class="label" data-js-air-quality-label>
                <span id="value">${this.value} / ${this.max}</span>
                <p id="status">${getStatus(this.value)}</p>
            </div>
        `
        this.needle = this.shadowRoot.querySelector('.needle');
        console.log(this.needle)
        if (this.needle) {
            needle.setAttribute('transform', `translate(${x - cx}, ${y - cy})`);
        }

    }

}

customElements.define('gauge-indicator', GaugeIndicator);