import { getStatus } from '../config/statuses.js';
export class GaugeIndicator extends HTMLElement {

    viewWidth = Number(this.getAttribute('view-width')) || 200;
    viewHeight = Number(this.getAttribute('view-height')) || 100;
    title = this.getAttribute('title') || 'Air Quality'
    max = Number(this.getAttribute('max') || 5);
    value = Number(this.getAttribute('value') || 0);
    progress = this.value / this.max;

    angleDeg = -90 + this.progress * 180;
    rad = this.angleDeg * (Math.PI / 180);

    cx = this.viewWidth / 2;
    cy = this.viewHeight * 0.9;
    radius = this.viewWidth * 0.4;
    arcLength = Math.round(Math.PI * this.radius);
    strokeWidth = this.radius * 0.2;
    dotRadius = this.radius * 0.1;

    x = this.cx + this.radius * Math.cos(this.rad);
    y = this.cy - this.radius * Math.sin(this.rad);

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                svg {
                    filter: drop-shadow(0rem 0rem 1rem #9874FF);
                    path {
                        stroke-linecap: round;
                    }
                }
                 
                p {
                    margin: 0;
                }

                #value {
                    font-size: 1.25rem;
                    font-weight: 400;
                }

                #status {
                    font-size: 1rem;
                }
            </style>
            <h3>${this.title}</h3>
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
                    stroke-dashoffset="${Math.round(this.arcLength * (1 - this.progress))}" />

                <g class="group" >
                    <circle class="needle" cx="${this.cx}" cy="${this.cy}" r="${this.dotRadius}" fill="#fff" />
                </g>
            </svg>
            <div class="label" data-js-air-quality-label>
                <span id="value">${this.value} / ${this.max}</span>
                <p id="status">${getStatus(this.value)}</p>
            </div>
        `
        this.needle = this.shadowRoot.querySelector('.group');
        if (this.needle) {
            this.needle.setAttribute('transform', `translate(${-(this.y - this.cy)}, ${-(this.x - this.cx)})`);
        }

    }

}

customElements.define('gauge-indicator', GaugeIndicator);