import { render, staticRenderFns } from './render.pug'
import OpenImage from './open-image/index.mjs'
export default {
  render,
  staticRenderFns,
  components: {
    OpenImage
  },
  data: () => {
    return {
      size: 200,
      first: null,
      second: null,
      items: []
    }
  },
  mounted () {
    import('./style.css')
  },
  methods: {
    onPaste (e) {
      // console.log('on paste', e.clipboardData)
      const files = [...e.clipboardData.files]
      files.forEach((file) => {
        this.parseImg(file)
      })
    },
    onDrop (e) {
      // console.log('on drop', e.dataTransfer)
      const files = [...e.dataTransfer.files]
      files.forEach((file) => {
        this.parseImg(file)
      })
    },
    parseImg: function (file) {
      const self = this
      const reader = new window.FileReader()
      reader.addEventListener('load', function () {
        const url = reader.result
        const img = new window.Image()
        img.onload = function () {
          self.insert(img)
        }
        img.src = url
      }, false)

      if (!file) {
        return
      }
      reader.readAsDataURL(file)
    },
    insert (img) {
      if (!img) {
        return
      }
      const id = this.items.length / 2
      for (let i = 0; i < 2; i++) {
        this.items.push({
          id: id,
          flipped: false,
          src: img.src
        })
      }
      this.reset()
    },
    choice (item) {
      if (this.second) {
        this.first.flipped = false
        this.second.flipped = false
        Object.assign(this, {
          first: null,
          second: null
        })
        return
      }

      if (item.flipped) {
        return
      }
      const { first } = this
      item.flipped = true
      if (!first) {
        this.first = item
        return
      }
      if (item.id !== first.id) {
        this.second = item
        return
      }
      this.first = null
    },
    reset () {
      const items = this.items
      const len = items.length
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const r = parseInt(Math.random() * len)
          const a = items[r]
          items[r] = items[i]
          items[i] = a
        }
      }

      Object.assign(this, {
        first: null,
        second: null
      })

      for (let i = 0; i < len; i++) {
        items[i].no = i + 1
        items[i].flipped = false
      }
    }
  }
}
