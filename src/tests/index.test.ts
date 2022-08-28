import t from 'tap'
import { create, insert, insertBatch } from '@lyrasearch/lyra'
import { generateWeights } from '../index'
import { countOccurrencies, getAllTokensInAllDocsByProperty } from '../utils'

t.test('countOccurrencies', async t => {
  t.plan(3)

  t.test('should correctly count occurrences of an element in an array', t => {
    t.plan(3)

    t.equal(countOccurrencies(['hello', 'hello', 'there'], 'hello'), 2)
    t.equal(countOccurrencies([10, 2030, 120, 3020, 849, 9249, 10], 10), 2)
    t.equal(countOccurrencies([10, 2030, 120, 3020, 849, 9249, 10], 3), 0)
  })

  t.test('should correctly get all tokens in all docs by property', t => {
    t.plan(1)

    const lyra = create({
      schema: {
        name: 'string',
        description: 'string'
      }
    })

    insert(lyra, {
      name: 'John Doe',
      description: 'My example description'
    })

    insert(lyra, {
      name: 'Jane Doe',
      description: 'Another example description'
    })

    const result = getAllTokensInAllDocsByProperty(lyra)

    t.matchSnapshot(result, `${t.name}-O1`)
  })

  t.test('it should correctly generate weights', async t => {
    t.plan(1)

    const lyra = create({
      schema: {
        category: 'string',
        headline: 'string',
        authors: 'string'
      }
    })

    const dataset = require('./datasets/news.json').map((data: any) => ({
      category: data.category,
      headline: data.headline,
      authors: data.authors
    }))

    await insertBatch(lyra, dataset)

    const result = generateWeights(lyra)

    t.matchSnapshot(result, `${t.name}-O1`)
  })
})
