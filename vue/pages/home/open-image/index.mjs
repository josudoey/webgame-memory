import { render, staticRenderFns } from './render.pug'

export default {
  render,
  staticRenderFns,
  props: [],
  data: function () {
    return {
      id: ''
    }
  },
  mounted: function () {
    this.id = `img-${this._uid}`
  },
  methods: {
    parseFile: function (e) {
      const self = this
      const input = e.srcElement
      const file = input.files[0]
      input.value = ''
      const reader = new window.FileReader()
      reader.addEventListener('load', function () {
        const url = reader.result
        const img = new window.Image()
        img.onload = function () {
          const { width, height } = this
          Object.assign(self, {
            width: width,
            height: height,
            url: url
          })
          self.$emit('load', img, self)
        }
        img.src = url
      }, false)

      if (!file) {
        return
      }
      reader.readAsDataURL(file)
    }
  }
}
