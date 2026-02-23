export class graph {
    constructor(rootEl, nameOfEl, numberOfDevisions) {
        this.rootEl = rootEl;
        this.nameOfEl = nameOfEl;
        this.selector = `data-js-${nameOfEl}`;
        this.numberOfDevisions = numberOfDevisions;
        this.el = this.rootEl.querySelector(`[${this.selector}]`);
        this.graphEl = this.el.querySelector(`[${this.selector}-svg]`);

        this.scale = this.graphEl.querySelector(`[${this.selector}-scale]`);
        this.graphWidth = this.graphEl.getAttribute('viewBox').split(" ")[2];
        this.strokeWidth = this.scale.getAttribute('stroke-width');
        this.radius = (this.graphWidth - 2 * this.strokeWidth) / 2;
        console.log(this.radius);
    }
}


