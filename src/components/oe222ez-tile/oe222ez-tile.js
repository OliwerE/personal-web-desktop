/**
 *
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
    width: 98px;
    height: 98px;
    float: left;
    border: 1px solid;
    cursor: pointer;
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
    <div class="tile-front">
      <!--FRONT-->
    </div>
    <div class="tile-back">
    <!--BACK-->
    </div>
  </div>
`

customElements.define('oe222ez-tile',
  /**
   * Class represents the custom oe222ez-memory element.
   */
  class extends HTMLElement {
    /**
     * Constructs the custom element.
     */
    constructor () {
      super()

      this.display = 'front'

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

    /*
    connectedCallback () {
      // this.addEventListener('click', this._tileClicked)
    }
    */

    /**
     * Rotates the tile when the attribute is changed.
     *
     * @param {string} name - The name of the attribute.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'display') {
        if (newValue === 'front') { // fix vad som händer om this.display är lika med newvalue!
          this.display = newValue
          this.shadowRoot.querySelector('.tile-sides-container').style.transform = 'rotateY(0deg)'
        } else if (newValue === 'back') {
          this.shadowRoot.querySelector('.tile-sides-container').style.transform = 'rotateY(180deg)'
        }
      }
    }

    /*
    disconnectedCallback () {
      // this.removeEventListener('click', this._tileClicked)
    }
    */

    /*
    _tileClicked () {

      // vänder tile
      this.shadowRoot.querySelector('.tile-sides-container').style.transform = 'rotateY(180deg)'

      // tile click event

      this.dispatchEvent(new CustomEvent('oe222ez-tile-clicked', {
        bubbles: true,
        detail: { class: this.className, id: this.id }
      }))

    }

    resetTile () {
      console.log('resets tile: ', this.id)

        this.shadowRoot.querySelector('.tile-sides-container').style.transform = 'rotateY(0deg)'
    }
    */

    /**
     * Removes the content of the tile.
     */
    removeTileContent () {
      // removes tile content
      this.shadowRoot.querySelector('.tile-sides-container').remove()

      // disables event listener

      // this.removeEventListener('click', this._tileClicked)
    }
  }
)
