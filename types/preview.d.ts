import type { PluginObject, VueConstructor } from 'vue'
import type { Config as DOMPurifyConfig } from 'dompurify'
import type { MarkdownRenderer } from './core'

export interface MarkdownTheme {
  name?: string
  previewClass: string
  markdownParser: MarkdownRenderer
  extend(
    callback: (parser: MarkdownRenderer, highlighter?: unknown) => void,
  ): void
}

export interface VMdPreviewComponent extends PluginObject<never> {
  name: 'v-md-preview'
  version: string
  install(Vue: VueConstructor): void
  theme(theme: MarkdownTheme): this
  use(theme: unknown, options?: unknown): this
  extendMarkdown(extender: (parser: MarkdownRenderer) => void): this
  xss: {
    process(dirtyHtml: string, options?: DOMPurifyConfig): string
    extend(options?: DOMPurifyConfig): unknown
    reset(): unknown
  }
}

declare const VMdPreview: VMdPreviewComponent

export default VMdPreview
