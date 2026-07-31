# Vue Markdown Kit

A small, auditable Markdown preview toolkit for Vue 2. It provides a
component-friendly preview API, a framework-independent renderer, and
GitHub-style presentation.

## Features

- Vue 2.6 and Vue 2.7 preview component
- Markdown rendering through markdown-it
- HTML sanitization through DOMPurify
- Opt-in, tree-shakeable highlight.js language registration
- GitHub-style Markdown CSS
- Image-click and rendered-content events
- Compatibility and modern package entry points

## Install

```sh
npm install vue-markdown-kit
```

## Legacy-style usage

Existing preview integrations can keep the same setup pattern and change only
the package prefix:

```js
import VMdPreview from 'vue-markdown-kit/lib/preview'
import 'vue-markdown-kit/lib/style/preview.css'

import githubTheme from 'vue-markdown-kit/lib/theme/github.js'
import 'vue-markdown-kit/lib/theme/style/github.css'

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', javascript)

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

export default {
  components: {
    'md-preview': VMdPreview,
  },
}
```

```vue
<md-preview :text="markdown" />
```

## Modern entry points

```js
import { VMdPreview, githubTheme } from 'vue-markdown-kit'
import 'vue-markdown-kit/style/preview.css'
import 'vue-markdown-kit/theme/style/github.css'

VMdPreview.use(githubTheme)
```

The framework-independent renderer can also be used directly:

```js
import {
  createMarkdownRenderer,
  sanitizeHtml,
} from 'vue-markdown-kit/core'

const parser = createMarkdownRenderer()
const safeHtml = sanitizeHtml(parser.render('# Hello'))
```

## Preview props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Markdown source |
| `theme` | `object` | `undefined` | Per-instance theme plugin or theme config |
| `tabSize` | `number` | `2` | CSS tab size |
| `scrollContainer` | `function` | `() => window` | Scroll target |
| `top` | `number` | `0` | Scroll offset |
| `sanitizeOptions` | `object` | `{}` | Additional DOMPurify options |

## Events

- `change(text, html)` after Markdown is rendered and sanitized.
- `image-click(images, index)` when a rendered image is clicked.

## Compatibility scope

Version 0.1 targets the preview APIs commonly required by Vue 2 applications.
It does not yet provide an editor component.

## Security

Raw HTML is enabled for compatibility, then sanitized as the final rendering
step. Applications that do not need raw HTML can pass `html: false` when
creating a custom renderer. Keep all runtime dependencies updated and apply
an application-level Markdown input length limit.

## License

MIT. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).
