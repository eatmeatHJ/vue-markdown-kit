import assert from 'node:assert/strict'
import test from 'node:test'
import { JSDOM } from 'jsdom'

test('mounts in Vue 2 and emits image-click with all image URLs', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.test/',
  })

  Object.defineProperties(globalThis, {
    window: {
      configurable: true,
      value: dom.window,
    },
    document: {
      configurable: true,
      value: dom.window.document,
    },
    navigator: {
      configurable: true,
      value: dom.window.navigator,
    },
  })

  const [{ default: Vue }, { default: VMdPreview }, { default: githubTheme }] =
    await Promise.all([
      import('vue'),
      import('../lib/preview.js'),
      import('../lib/theme/github.js'),
    ])

  VMdPreview.use(githubTheme)

  const Preview = Vue.extend(VMdPreview)
  const preview = new Preview({
    propsData: {
      text: '![one](https://example.test/one.png)\n\n![two](https://example.test/two.png)',
    },
  })

  let emitted
  preview.$on('image-click', (images, index) => {
    emitted = { images, index }
  })

  preview.$mount()
  document.body.appendChild(preview.$el)
  await Vue.nextTick()

  const images = preview.$el.querySelectorAll('img')
  assert.equal(images.length, 2)

  images[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }))

  assert.deepEqual(emitted, {
    images: [
      'https://example.test/one.png',
      'https://example.test/two.png',
    ],
    index: 1,
  })

  preview.$destroy()
  dom.window.close()
  delete globalThis.window
  delete globalThis.document
  delete globalThis.navigator
})
