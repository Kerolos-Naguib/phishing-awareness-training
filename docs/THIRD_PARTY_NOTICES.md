# Third-party notices

This file lists third-party software and assets that are **shipped inside the deliverables**, with their licenses, so the repository owner can meet attribution requirements. It is informational and is not legal advice.

## Shipped in `web-module/index.html`

The standalone page contains a production bundle of these libraries (versions as built):

| Library | Version | License |
|---|---|---|
| React | 19.2.5 | MIT |
| React DOM | 19.2.5 | MIT |
| Scheduler (used by React DOM) | 0.27.0 | MIT |

The module's own icons are small inline SVG paths written for this project. No fonts, images or CSS frameworks are bundled.

> **Note:** the build step (`esbuild`, option `legalComments: "none"`) removed the license comments that React normally carries inside its bundle. The full license texts are therefore reproduced below. See "Open items" at the end.

### React / React DOM / Scheduler license text (as found in the installed packages)

```
----- react -----
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

----- react-dom -----
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

----- scheduler -----
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

## Shipped in `presentation/Phishing_Awareness_Training_EN.pptx`

The slide icons were rendered from the **Font Awesome 5** set, obtained through the `react-icons` package (version 5.6.0, MIT). According to the `react-icons` documentation, the Font Awesome 5 icons (version 5.15.4) are licensed under **CC BY 4.0**, which requires attribution:

> Icons: Font Awesome (https://fontawesome.com/), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Icons were converted to PNG images and recolored for this presentation.

The deck uses the **Calibri** font by name only; no font file is embedded or distributed.

## Development tools (not distributed in the repository)

| Tool | Version used | License |
|---|---|---|
| PptxGenJS (builds the deck) | 4.0.1 | MIT |
| react-icons | 5.6.0 | MIT (icon sets carry their own licenses, see above) |
| sharp (icon conversion) | 0.34.5 | Apache-2.0 |
| esbuild (bundler) | 0.27.7 | MIT |
| TypeScript | installed 6.0.3, not used for type checking | Apache-2.0 |
| Playwright (tests) | 1.56.0 | Apache-2.0 |
| python-pptx (cross-checks) | 1.0.2 | MIT (read from the installed package metadata) |

License fields were read from the installed packages' metadata.

## Open items

1. **Decide how to keep license notices with the bundle.** Either rebuild with `legalComments: "eof"` in `web-module/source/build.cjs` (this would change `index.html`, so the tests should be rerun) or keep this file distributed alongside `index.html`.
2. **Confirm attribution placement** for the Font Awesome icons in the presentation (for example, a credits line on the References slide or in the notes).
3. **Project license:** none has been chosen. See the README.
