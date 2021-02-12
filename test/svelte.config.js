const sveltePreprocess = require('svelte-preprocess');

const preprocess = sveltePreprocess({
  typescript: {
    tsconfigFile: './tsconfig.json'
  }
});

module.exports = {
  preprocess
};