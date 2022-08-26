import type { PropertiesSchema, Lyra } from '@lyrasearch/lyra'
import { tokenize } from '@lyrasearch/lyra'

export function countOccurrencies<T> (list: T[], target: T): number {
  return list.reduce((acc, item) => (item === target ? acc + 1 : acc), 0)
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

export function generateWeights<T extends PropertiesSchema> (lyra: Lyra<T>) {
  const docs = lyra.docs
  const N = Object.keys(docs).length
  const allTokensInDocs = getAllTokensInAllDocsByProperty(lyra)
  const weights = {}

  for (const docID in docs) {
    const properties = docs[docID]

    for (const property in properties) {
      if (!(property in weights)) {
        // @ts-expect-error
        weights[property] = {}
      }

      const d = properties[property]

      const tokens = tokenize(d as string, lyra.defaultLanguage, true)

      for (const t of tokens) {
        const tf = countOccurrencies(tokens, t) / tokens.length
        const df = countOccurrencies(allTokensInDocs[property], t)
        const idf = Math.log(N / df)
        const tfIdf = tf * idf

        // @ts-expect-error
        if (!(docID in weights[property])) {
          // @ts-expect-error
          weights[property][docID] = {
            [t]: tfIdf
          }
        } else {
          // @ts-expect-error
          weights[property][docID][t] = tfIdf
        }
      }
    }
  }
}
