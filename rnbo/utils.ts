import { Oscillator } from 'tone';

export const dummy = new Oscillator({volume: -Infinity, frequency: 0, type: 'sine1'}).start();

export const min = (a: number, b: number) => a < b ? a : b;