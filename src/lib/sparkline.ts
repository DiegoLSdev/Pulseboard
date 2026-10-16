export const WIDTH = 100;
export const HEIGHT = 32;

export function toPoints(values: number[]): string {
    const max = Math.max(...values);
    const step = WIDTH / (values.length - 1);

    return values.map((value, index) => {
        const x = index * step;
        const y = HEIGHT - (value / max) * HEIGHT;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
}
