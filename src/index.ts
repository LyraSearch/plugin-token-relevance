import type { PropertiesSchema, Lyra } from '@lyrasearch/lyra'
import { tokenize } from '@lyrasearch/lyra'

export interface TFIDFScores {
  [Property: string]: {
    [DocID: string]: {
      [TFIDF: string]: number
    }
  }
}

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

export function generateWeights<T extends PropertiesSchema> (lyra: Lyra<T>): TFIDFScores {
  const docs = lyra.docs
  const N = Object.keys(docs).length
  const allTokensInDocs = getAllTokensInAllDocsByProperty(lyra)
  const weights: TFIDFScores = {}

  for (const docID in docs) {
    const properties = docs[docID]

    for (const property in properties) {
      if (!(property in weights)) {
        weights[property] = {}
      }

      const d = properties[property] as string
      const tokens = tokenize(d, lyra.defaultLanguage, true)

      for (const t of tokens) {
        const tf = countOccurrencies(tokens, t) / tokens.length
        const df = countOccurrencies(allTokensInDocs[property], t)
        const idf = Math.log(N / df)
        const tfIdf = tf * idf

        if (!(docID in weights[property])) {
          weights[property][docID] = {
            [t]: tfIdf
          }
        } else {
          weights[property][docID][t] = tfIdf
        }
      }
    }
  }

  return weights
}
