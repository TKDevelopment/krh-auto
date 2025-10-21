/* Minimal critical inlining script.
 * This attempts to require('critical') and inline critical CSS into dist/index.html after a production build.
 * It is written defensively so it won't crash if 'critical' isn't installed.
 */

const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const critical = require('critical');
    const dist = path.resolve(__dirname, '../dist/krh-auto');
    const indexFile = path.join(dist, 'index.html');
    if (!fs.existsSync(indexFile)) {
      console.log('No index.html found in', dist);
      return;
    }

    console.log('Running critical to inline CSS into', indexFile);

    // Try to find the built styles file in the dist directory (e.g. styles-<hash>.css)
    const files = fs.readdirSync(dist);
    const stylesFile = files.find((f) => /^styles(\.|-|_).*\.css$/.test(f) || /^styles.*\.css$/.test(f));
    const cssPath = stylesFile ? path.join(dist, stylesFile) : null;

    const generateOptions = {
      base: dist,
      src: 'index.html',
      target: {
        html: 'index.html',
      },
      inline: true,
      width: 1300,
      height: 900,
      minify: true,
    };

    if (cssPath) {
      console.log('Found styles file:', stylesFile, '— passing explicit css option to critical.');
      generateOptions.css = [cssPath];
    } else {
      console.log('No styles file detected in dist; letting critical resolve styles from HTML.');
    }

    await critical.generate(generateOptions);
    console.log('Critical CSS inlined.');
  } catch (err) {
    console.log('Skipping critical step: critical package not installed or an error occurred.', err && err.message);
  }
})();
