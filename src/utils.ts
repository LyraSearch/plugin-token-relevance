import type { PropertiesSchema, Lyra } from '@lyrasearch/lyra'
import { tokenize } from '@lyrasearch/lyra'

export function countOccurrencies<T> (list: T[], target: T): number {
  let count = 0
  for (let i = 0; i < list.length; i++) {
    if (list[i] === target) {
      count++
    }
  }
  return count
}

export function getAllTokensInAllDocsByProperty<T extends PropertiesSchema> (
  lyra: Lyra<T>
): { [key: string]: string[] } {
  const docs = lyra.docs
  const properties = Object.keys(lyra.schema).filter(property => lyra.schema[property] === 'string')
  const individualTokens = properties.reduce((acc, property) => ({ ...acc, [property]: [] }), {})

  for (const property of properties) {
    const individualProperty = (individualTokens as any)[property]
    for (const doc in docs) {
      const currentDoc = docs[doc]![property]
      const tokens = tokenize(currentDoc as string)
      individualProperty.push(...tokens)
    }

    (individualTokens as any)[property] = individualProperty
  }

  return individualTokens
}
