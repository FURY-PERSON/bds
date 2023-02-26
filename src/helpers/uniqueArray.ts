export const uniqueArray = (array: Array<any>) => {
  return [...new Set(array.map(item => JSON.stringify(item)))].map(s => JSON.parse(s))
}