export const capitalize = (string) => string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

export const isValidNumber = (value) => value !== undefined || (typeof value === 'number' && !isNaN(value));