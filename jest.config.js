module.exports = {
  transform: {
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        "preprocess": './test/svelte.config.js'
      }
    ],
    "^.+\\.ts$": "ts-jest",
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'svelte']
}