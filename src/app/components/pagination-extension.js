import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const Pagination = Extension.create({
  name: 'pagination',

  addOptions() {
    return {
      pageHeight: 1056, // 11in * 96dpi
      margin: 96, // 1in * 96dpi
      contentHeight: 864, // 1056 - 96 - 96
    }
  },

  addProseMirrorPlugins() {
    const { pageHeight, margin, contentHeight } = this.options

    const pluginKey = new PluginKey('pagination')

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, value) {
            const newSet = tr.getMeta(pluginKey)
            if (newSet) return newSet
            return value.map(tr.mapping, tr.doc)
          }
        },
        props: {
          decorations(state) {
            return pluginKey.getState(state)
          },
        },
        view(editorView) {
          // Helper to measure and update decorations
          const checkPagination = () => {
            // We need to measure the DOM nodes
            // This requires the view to be rendered
            const { doc } = editorView.state
            const decorations = []

            // Measure editor top to compute page indices by absolute position
            const editorRect = editorView.dom.getBoundingClientRect()
            let lastPageSeen = 1

            // Iterate top-level nodes and compute their page based on DOM top
            editorView.state.doc.forEach((node, pos) => {
              const dom = editorView.nodeDOM(pos)
              if (!dom || !dom.getBoundingClientRect) return

              const rect = dom.getBoundingClientRect()
              // distance from top of content area (accounting for margin)
              const distanceFromContentTop = rect.top - editorRect.top - margin
              const pageIndex = Math.max(1, Math.floor(distanceFromContentTop / contentHeight) + 1)

              // If this node begins a new page that we haven't seen yet, insert a page-break widget
              if (pageIndex > lastPageSeen) {
                const decoration = Decoration.widget(pos, () => {
                  const el = document.createElement('div')
                  el.className = 'page-break-widget'
                  el.dataset.pageNumber = String(pageIndex)
                  return el
                }, { side: -1 })

                decorations.push(decoration)
                lastPageSeen = pageIndex
              }
            })

            const currentSet = pluginKey.getState(editorView.state) || DecorationSet.empty
            const newSet = DecorationSet.create(doc, decorations)

            const oldDecos = currentSet.find()
            const newDecos = newSet.find()

            let hasChanges = oldDecos.length !== newDecos.length
            if (!hasChanges) {
              for (let i = 0; i < oldDecos.length; i++) {
                if (oldDecos[i].from !== newDecos[i].from) {
                  hasChanges = true
                  break
                }
              }
            }

            if (hasChanges) {
              const tr = editorView.state.tr.setMeta(pluginKey, newSet)
              editorView.dispatch(tr)
            }
          }

          // Initial check
          setTimeout(checkPagination, 100)

          return {
            update(view, prevState) {
              // Only check if the document changed
              if (!prevState.doc.eq(view.state.doc)) {
                requestAnimationFrame(checkPagination)
              }
            }
          }
        },
        
      }),
    ]
  },
})
