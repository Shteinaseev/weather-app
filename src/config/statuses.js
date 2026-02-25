const STATUS_MAPS = {
    air: new Map([
        [6, "Hazardous"],
        [5, "Very Unhealthy"],
        [4, "Unhealthy"],
        [3, "Unhealthy (Sensitive)"],
        [2, "Moderate"],
        [1, "Good"],
        [0, "Excellent"]
    ]),


    uv: new Map([
        [10, "Extreme (Avoid outdoors)"],
        [9, "Extremely Dangerous"],
        [8, "Very Dangerous"],
        [7, "Dangerous"],
        [6, "High Risk"],
        [5, "Unhealthy"],
        [4, "Poor"],
        [3, "Moderate"],
        [2, "Fair"],
        [1, "Good"],
        [0, "Excellent"]
    ])
};

export function getStatus(value, scale = 'air') {
    const map = STATUS_MAPS[scale] || STATUS_MAPS.air;

    value = Math.floor(value);

    for (const [threshold, text] of map) {
        if (value >= threshold) {
            return text;
        }
    }

    return "Excellent";
}