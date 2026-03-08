import {
    Map,
    MapStyle,
    config,
    ScaleControl
} from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { PrecipitationLayer, ColorRamp } from '@maptiler/weather';


export class PrecipitationMap {
    constructor() {
        config.apiKey = 'FEI2ZJDnGcrvTFnSyu4k';
        this.map = new Map({
            container: 'map',
            style: MapStyle.STREETS.DARK,
            center: [16.62662018, 49.2125578], // starting position [lng, lat]
            zoom: 7,
            hash: true,
            projectionControl: true
        });

        const hexToRgba = (hex) => {
            hex = hex.replace('#', '');
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return [r, g, b, 255];
        };

        const customStops = [
            [0.00, '#00000000'],
            [0.01, '#00ff00'],
            [0.05, '#ffff00'],
            [0.15, '#ff9900'],
            [0.30, '#ff0000'],
            [0.50, '#ff00ff'],
            [1.00, '#800080']
        ];

        const rampStops = customStops.map(([value, color]) => ({
            value,
            color: hexToRgba(color)
        }));

        const customRamp = new ColorRamp({
            stops: rampStops,
            smooth: true
        });

        const weatherLayer = new PrecipitationLayer({
            opacity: 0.25,
            colorramp: customRamp
        });

        this.map.on('load', () => {
            this.map.setPaintProperty('Water', 'fill-color', 'rgba(10,20,40,0.5)');
            this.map.addLayer(weatherLayer, 'Water');
            weatherLayer.animateByFactor(3600);

            console.log('Слой осадков добавлен');
        });

        this.map.addControl(new ScaleControl(), 'bottom-left');
    }

}