// postcss.config.js
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssReporter from 'postcss-reporter';

// Import tailwind.config.js using the ES module syntax
import tailwindConfig from './tailwind.config.js';

export default {
  plugins: [
    tailwindcss(tailwindConfig), // Pass the configuration object directly
    autoprefixer({
      overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead', 'not ie <= 11'],
      cascade: false,
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
