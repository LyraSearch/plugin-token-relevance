# Token Relevance Plugin

[![Tests](https://github.com/LyraSearch/plugin-token-relevance/actions/workflows/tests.yml/badge.svg)](https://github.com/LyraSearch/plugin-token-relevance/actions/workflows/tests.yml)

Plugin to add TF-IDF scores to a Lyra index.

| Runtime        | Status            |
| -------------- | ----------------- |
| Node.js        | ✅ &nbsp;available |
| Bun            | ✅ &nbsp;available |
| V8 isolates    | ✅ &nbsp;available |
| Major browsers | ✅ &nbsp;available |
| Deno           | ✅ &nbsp;available |

# Usage

For the complete usage guide, please refer to the
[official plugin documentation](https://docs.lyrajs.io/docs/plugins/plugin-token-relevance).

## TL;DR

```js
import { create, insert } from "@lyrasearch/lyra";
import { generateScores } from "plugin-token-relevance";

const db = create({
  schema: {
    author: "string",
    quote: "string",
  },
});

insert(db, {
  quote: "The quick brown fox jumps over the lazy dog",
  author: "John Doe",
});

insert(db, {
  quote: "This quick brown fox is so quick! How can it be so quick?",
  author: "Jane Doe",
});

insert(db, {
  quote: "I have a pair of red shoes.",
  author: "Jimmy Does",
});

const scores = generateScores(db);

console.log(scores);
```

```js
{
  quote: {
    '76465079-2': {
      the: 0.24413606414846878,
      quick: 0.04505167867868493,
      brown: 0.04505167867868493,
      fox: 0.04505167867868493,
      jumps: 0.12206803207423439,
      over: 0.12206803207423439,
      lazy: 0.12206803207423439,
      dog: 0.12206803207423439
    },
    '76465079-42': {
      this: 0.08450863758985458,
      quick: 0.0935688711018841,
      brown: 0.03118962370062803,
      fox: 0.03118962370062803,
      is: 0.08450863758985458,
      so: 0.16901727517970916,
      how: 0.08450863758985458,
      can: 0.08450863758985458,
      it: 0.08450863758985458,
      be: 0.08450863758985458
    },
    '76465079-60': {
      i: 0.1569446126668728,
      have: 0.1569446126668728,
      a: 0.1569446126668728,
      pair: 0.1569446126668728,
      of: 0.1569446126668728,
      red: 0.1569446126668728,
      shoes: 0.1569446126668728
    }
  },
  author: {
    '76465079-2': { john: 0.5493061443340548, doe: 0.2027325540540822 },
    '76465079-42': { jane: 0.5493061443340548, doe: 0.2027325540540822 },
    '76465079-60': { jimmy: 0.5493061443340548, does: 0.5493061443340548 }
  }
}
```

# License

[Apache-2.0](/LICENSE.md)
