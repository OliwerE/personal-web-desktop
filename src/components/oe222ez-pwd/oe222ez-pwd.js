/**
 *
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */


const template = document.createElement('template')
template.innerHTML = `
<style>
#windowContainer {
    display: block;
    background-color: orange;
    height: 90vh;
    width: 100%;
    margin: 0;
    padding: 0;
}

#dock {
    height: 10vh;
    background-color: blue;
}
</style>
<div id="windowContainer" ">

</div>
<div id="dock">
  <button id="memoryWindow">Add memory</button>
  <button id="messageWindow">Add message app</button>
  <button id="weatherWindow">Add weather window</button>
</div>
 `

customElements.define('oe222ez-pwd',
  class extends HTMLElement {

    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      return []
    }

    connectedCallback () {

    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    disconnectedCallback () {

    }


  }
)
