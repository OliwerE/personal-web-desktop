/**
 * Represents a rotating tile.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    position: relative;
    perspective: 600px;
    width: 95px;
    height: 95px;
    float: left;
    cursor: pointer;
    margin-left: 3px;
    margin-bottom: 3px;
}

.tile-front {
  background-color: #FDED32;
  background-size: contain;
}

.tile-back {
  transform: rotateY(180deg);
  background-color: #FDED32;
  background-size: contain;
}

.tile-front, .tile-back {
  width: 100%;
  height: 100%;
  position: absolute;
}

.tile-sides-container {
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
</style>

  <div class="tile-sides-container">
    <div class="tile-front"></div>
    <div class="tile-back"></div>
  </div>
`

customElements.define('oe222ez-tile',
  /**
   * Class represents the custom oe222ez-tile element.
   */
  class extends HTMLElement {
    /**
     * Constructs the custom element.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Observes the custom display attribute.
     *
     * @returns {Array} - An array with the observed attributes.
     */
    static get observedAttributes () {
      return ['display']
    }

    /**
     * Rotates the tile when the attribute is changed.
     *
     * @param {string} name - The name of the attribute.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'display') {
        if (newValue === 'front') {
          this.shadowRoot.querySelector('.tile-sides-container').style.transform = 'rotateY(0deg)' // Displays the front side of the tile
        } else if (newValue === 'back') {
          this.shadowRoot.querySelector('.tile-sides-container').style.transform = 'rotateY(180deg)' // Displays the back side of the tile
        }
      }
    }

    /**
     * Removes the content of the tile.
     */
    removeTileContent () {
      this.shadowRoot.querySelector('.tile-sides-container').remove()
    }
  }
)
