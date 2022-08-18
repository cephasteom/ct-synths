import { immediate } from "tone"

export function formatCurve(type) {
    const types = {
        exp: 'exponential',
        lin: 'linear'
    }
    return Object.keys(types).includes(type) ? types[type] : 'linear'
}

export const timeToEvent = (time) => time - immediate()
export const doAtTime = (callback, time) => setTimeout(callback, timeToEvent(time) * 1000)