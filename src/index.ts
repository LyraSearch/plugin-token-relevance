import type { PropertiesSchema, Lyra } from '@lyrasearch/lyra'
import { tokenize } from '@lyrasearch/lyra'
import { getAllTokensInAllDocsByProperty, countOccurrencies } from './utils'

export interface TFIDFScores {
  [Property: string]: {
    [DocID: string]: {
      [TFIDF: string]: number
    }
  }
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
