import isObject from 'lodash/isObject.js'

export function orArray(param) {
    return Array.isArray(param) ? param : []
}

export function orObject(param) {
    return isObject(param) ? param : {}
}

// object
export function arrayToIdMap(array) {
    return array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
    }, {})
}

export function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true // Same reference

    if (
        typeof obj1 !== 'object' ||
        typeof obj2 !== 'object' ||
        obj1 == null ||
        obj2 == null
    )
        return false // Not objects or null values

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false // Arrays must be same length
        return obj1.every((item, index) => deepEqual(item, obj2[index])) // Compare array items recursively
    }

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false // Different number of keys

    return keys1.every((key) => deepEqual(obj1[key], obj2[key])) // Recursively compare values
}

// reducer validator
export const validateReducer = (value, defaultValue) =>
    value === undefined || value === null ? defaultValue : value
