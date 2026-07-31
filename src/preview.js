import { createMarkdownRenderer } from './core/renderer.js'
import { sanitizer } from './core/sanitize.js'
import { version } from './version.js'

const defaultThemeConfig = {
  name: 'base',
  previewClass: 'vmk-markdown-body',
  markdownParser: createMarkdownRenderer(),
  extend(callback) {
    callback(this.markdownParser)
  },
}

const markdownExtenders = []
let activeThemeConfig = defaultThemeConfig

function installTheme(theme, options) {
  if (!theme) return

  if (typeof theme === 'function') {
    theme(VMdPreview, options)
  } else if (typeof theme.install === 'function') {
    theme.install(VMdPreview, options)
  } else if (theme.markdownParser) {
    VMdPreview.theme(theme)
  }
}

const VMdPreview = {
  name: 'v-md-preview',

  props: {
    text: {
      type: String,
      default: '',
    },
    theme: {
      type: Object,
      default: undefined,
    },
    tabSize: {
      type: Number,
      default: 2,
    },
    scrollContainer: {
      type: Function,
      default: () => window,
    },
    top: {
      type: Number,
      default: 0,
    },
    sanitizeOptions: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      html: '',
    }
  },

  computed: {
    themeConfig() {
      return activeThemeConfig
    },

    markdownParser() {
      return this.themeConfig.markdownParser
    },
  },

  watch: {
    text() {
      this.handleTextChange()
    },

    sanitizeOptions: {
      deep: true,
      handler() {
        this.handleTextChange()
      },
    },
  },

  created() {
    if (this.theme) {
      installTheme(this.theme)
    }

    for (const extender of markdownExtenders) {
      extender(this.markdownParser)
    }

    this.handleTextChange()
  },

  methods: {
    handleTextChange() {
      const rawHtml = this.markdownParser.render(this.text || '')
      this.html = sanitizer.process(rawHtml, this.sanitizeOptions)
      this.$emit('change', this.text, this.html)
    },

    handlePreviewClick(event) {
      const target = event.target

      if (!target || target.tagName !== 'IMG') {
        return
      }

      const images = Array.from(this.$el.querySelectorAll('img'))
        .map((image) => image.getAttribute('src'))
        .filter(Boolean)
      const index = Array.from(this.$el.querySelectorAll('img')).indexOf(target)

      this.$emit('image-click', images, index)
    },
  },

  render(createElement) {
    return createElement(
      'div',
      {
        class: 'vue-markdown-kit-preview',
        style: {
          tabSize: this.tabSize,
          MozTabSize: this.tabSize,
        },
        on: {
          click: this.handlePreviewClick,
        },
      },
      [
        createElement('div', {
          class: this.themeConfig.previewClass,
          domProps: {
            innerHTML: this.html,
          },
        }),
      ],
    )
  },
}

VMdPreview.version = version
VMdPreview.install = (Vue) => {
  Vue.component(VMdPreview.name, VMdPreview)
}
VMdPreview.theme = (themeConfig) => {
  activeThemeConfig = themeConfig || defaultThemeConfig
  return VMdPreview
}
VMdPreview.use = (theme, options) => {
  installTheme(theme, options)
  return VMdPreview
}
VMdPreview.extendMarkdown = (extender) => {
  markdownExtenders.push(extender)
  return VMdPreview
}
VMdPreview.xss = sanitizer
VMdPreview.lang = {
  use() {},
  add() {},
}

export default VMdPreview
