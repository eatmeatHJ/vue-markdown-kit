import Vue from 'vue'
import VueMarkdownKit, {
  VMdPreview,
  createGithubTheme,
  createMarkdownRenderer,
  sanitizeHtml,
} from 'vue-markdown-kit'
import LegacyPreview from 'vue-markdown-kit/lib/preview'
import legacyGithubTheme from 'vue-markdown-kit/lib/theme/github.js'

Vue.use(VueMarkdownKit)
Vue.use(VMdPreview)

const parser = createMarkdownRenderer({
  html: true,
  linkify: false,
})

const theme = createGithubTheme()
const html: string = sanitizeHtml(parser.render('# Typed'))

VMdPreview.theme(theme)
VMdPreview.use(legacyGithubTheme)
LegacyPreview.extendMarkdown((markdownParser) => {
  markdownParser.set({
    breaks: true,
  })
})

void html
