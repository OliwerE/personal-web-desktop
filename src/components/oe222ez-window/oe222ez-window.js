/**
 *
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#window {
  width: 300px;
  height: 200px;
  background-color: green;
}
</style>
<div id="window">
  Window!
</div>

`

customElements.define('oe222ez-window',
  class extends HTMLElement {

    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    connectedCallback () {
      console.log('A window component has started')
    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    disconnectedCallback () {
    }
  }
)
