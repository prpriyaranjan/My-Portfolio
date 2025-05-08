import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssReporter from 'postcss-reporter';

// Use require() to load CommonJS config
const tailwindConfig = require('./tailwind.config.js');

export default {
  plugins: [
    tailwindcss(tailwindConfig),
    autoprefixer({
      overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead', 'not ie <= 11'],
      cascade: false,
      add: true,
      remove: true,
    }),
    postcssNested(),
    postcssCustomProperties(),
    postcssPseudoClassAnyLink(),
    postcssReporter({
      clearReportedMessages: true,
      throwError: false,
    }),
  ],
  map: {
    inline: false,
    annotation: true,
  },
};
