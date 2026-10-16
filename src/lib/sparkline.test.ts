import { describe, expect, it } from "vitest";
import { HEIGHT, toPoints, WIDTH } from "./sparkline";

describe("toPoints", () => {
  it("draws the highest value at the top (y = 0) and zero at the bottom", () => {
    const points = toPoints([10, 0]).split(" ");
    expect(points).toHaveLength(2);

    const [, firstY] = points[0].split(",").map(Number);
    const [, secondY] = points[1].split(",").map(Number);

    // Highest value (10) should have y = 0
    expect(firstY).toBe(0);
    // Zero value should have y = HEIGHT (32)
    expect(secondY).toBe(HEIGHT);
  });

  it("places the first point at x = 0 and the last at x = 100", () => {
    const points = toPoints([5, 10, 20]).split(" ");
    const [firstX] = points[0].split(",").map(Number);
    const [lastX] = points[points.length - 1].split(",").map(Number);

    expect(firstX).toBe(0);
    expect(lastX).toBe(WIDTH);
  });

  it("produces exactly two points for two values", () => {
    const points = toPoints([3, 7]).split(" ");
    expect(points).toHaveLength(2);
    // 3 out of 7: y = 32 - (3 / 7) * 32 = 18.29
    expect(points[0]).toBe("0.00,18.29");
    // 7 out of 7: y = 32 - (7 / 7) * 32 = 0.00
    expect(points[1]).toBe("100.00,0.00");
  });

  it("distributes x coordinates evenly across multiple points", () => {
    const points = toPoints([0, 50, 100]).split(" ");
    expect(points).toEqual(["0.00,32.00", "50.00,16.00", "100.00,0.00"]);
  });
});
