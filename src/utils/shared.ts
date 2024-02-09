export const validateObjectFieldsOnValue = (obj: object) => {
  const result: string[] = []

  for (const key in obj) {
    if (!obj[key]) {
      result.push(key)
    }
  }

  return result
}

export const capitalizeFirstLetter = (str: string): string => {
  const firstLetter = str.charAt(0)
  return str.replace(firstLetter, firstLetter.toUpperCase())
}
