/**
 *
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#startMenu {
  display:block;
  background-color: green;
  width: 100%;
  height: 270px;
}
h1 {
  text-align: center;
  margin: 0;
}
</style>
<div id="startMenu">
<h1>Weather</h1>
<div id="getCityWeatherContainer">
<input id="city" type="text" placeholder="City"/>
</div>
</div>
`

customElements.define('oe222ez-weather',
  class extends HTMLElement {

    constructor () {
      super()


      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      //return []
    }

    connectedCallback () {

    }

    attributeChangedCallback (name, oldValue, newValue) {


    }

    disconnectedCallback () {

    }


    

  }
)
