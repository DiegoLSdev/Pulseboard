const WIDTH = 100;
const HEIGHT = 32;

function toPoints(values: number[]): string {
    const max = Math.max(...values);
    const step = WIDTH / (values.length - 1);

    return values.map((value, index) => {
        const x = index * step;
        const y = HEIGHT - (value / max) * HEIGHT
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
}

export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 0);

  if (values.length < 2 || max === 0) {
    return (
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-8 w-full"
        role="img"
        aria-label="No visits"
      >
        <line
          x1="0"
          x2={WIDTH}
          y1={HEIGHT - 1}
          y2={HEIGHT - 1}
          className="stroke-black/15 dark:stroke-white/20"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="h-8 w-full overflow-visible"
      role="img"
      aria-label={`Visitors per day: ${values.join(", ")}`}
    >
      <polyline
        points={toPoints(values)}
        fill="none"
        className="stroke-[#2a78d6] dark:stroke-[#3987e5]"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}