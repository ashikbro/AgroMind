// Migrated from frontend/src/utils/analytics.js
// Advanced Analytics Utils with ML Algorithms

export class LinearRegression {
  slope: number = 0;
  intercept: number = 0;
  trained: boolean = false;

  train(xData: number[], yData: number[]): this {
    if (xData.length !== yData.length) {
      throw new Error('X and Y data must have the same length');
    }
    const n = xData.length;
    const sumX = xData.reduce((sum, x) => sum + x, 0);
    const sumY = yData.reduce((sum, y) => sum + y, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumXX = xData.reduce((sum, x) => sum + x * x, 0);
    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
    this.trained = true;
    return this;
  }

  predict(x: number): number {
    if (!this.trained) {
      throw new Error('Model must be trained before making predictions');
    }
    return this.slope * x + this.intercept;
  }

  getR2Score(xData: number[], yData: number[]): number {
    const predictions = xData.map(x => this.predict(x));
    const yMean = yData.reduce((sum, y) => sum + y, 0) / yData.length;
    const totalSumSquares = yData.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const residualSumSquares = yData.reduce((sum, y, i) => sum + Math.pow(y - predictions[i], 2), 0);
    return 1 - (residualSumSquares / totalSumSquares);
  }
}

export class MovingAverage {
  windowSize: number;
  data: number[] = [];

  constructor(windowSize = 7) {
    this.windowSize = windowSize;
  }

  addDataPoint(value: number): void {
    this.data.push(value);
    if (this.data.length > this.windowSize) {
      this.data.shift();
    }
  }

  getAverage(): number {
    if (this.data.length === 0) return 0;
    return this.data.reduce((sum, val) => sum + val, 0) / this.data.length;
  }
}

// ...other advanced analytics utilities
