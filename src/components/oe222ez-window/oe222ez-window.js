/**
 * Represents a window element.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#window {
  position: absolute;
  min-width: 400px;
  min-height: 300px;
  background-color: #ffffff;
  border: 5px solid;
}

#windowHeader {
  float: left;
  overflow: hidden;
  background-color: #9effff;
  width: 90%;
  height: 30px;
}


#closeWindowBtn {
  cursor: default;
  overflow: hidden;
  background-color: red;
  height: 30px;
  width: 10%;
  text-align: center;
  font-size: 25px;
  font-weight: bold;

}
</style>
<div id="window">
<div id="windowHeader"></div>
<div id="closeWindowBtn" tabindex="0">X</div>
  <slot id="windowSlot" name="application"></slot>
</div>

`

customElements.define('oe222ez-window',
  /**
   * Class represents the custom oe222ez-window element.
   */
  class extends HTMLElement {
    /**
     * Constructs the custom element.
     */
    constructor () {
      super()

      this.windowElement = undefined

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /*
    static get observedAttributes () {
      return ['windowElement']
    }
    */

    /**
     * Adds the components event listeners.
     */
    connectedCallback () {
      console.log('A window component added to dom!')

      this.style.zIndex = 1 // Default Zindex
      this.setHighestZindex() // fönsterkomponenten får högsta z-index

      // Element som används i komponenten
      this.window = this.shadowRoot.querySelector('#window')
      this.windowHeader = this.shadowRoot.querySelector('#windowHeader')
      this.closeElementDiv = this.shadowRoot.querySelector('#closeWindowBtn')

      this.style.position = 'absolute'

      // event lyssnare för stäng knappen
      this.closeElementDiv.addEventListener('click', () => {
        this.remove()

        this.dispatchEvent(new CustomEvent('oe222ez-window-close', {
          bubbles: true, // behövs bubbles??
          detail: { msg: 'fönster stänger!' }
        }))
      })

      this.window.addEventListener('mousedown', this.setHighestZindex.bind(this))

      this.windowHeader.addEventListener('mousedown', this.moveWindow.bind(this))
    }

    /*
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'windowElement') { // kontrollera att detta är ett element:  <namn>
        console.log('window edit!')
        this.windowElement = newValue
        this.addElementToWindow()
      }
    }
    */

    /*
    disconnectedCallback () {
      // TA BORT EVENTLYSSNARE!
    }
    */

    /**
     * Method gives this window element the highest z-index.
     */
    setHighestZindex () {
      console.log('Nuvarane zindex: ', this.style.zIndex)

      // skapar en array med alla element i domen
      const zIndexarray = Array.from(this.shadowRoot.host.parentNode.querySelectorAll('oe222ez-window'))

      console.log(zIndexarray)

      // loopar igenom alla window element och loggar
      const allZIndex = []
      for (let i = 0; i < zIndexarray.length; i++) {
        console.log(i)
        const zIndexNumber = parseInt(zIndexarray[i].style.zIndex)

        console.log('loop: ', zIndexNumber)

        allZIndex.push(zIndexNumber)
      }

      const sortedZIndex = allZIndex.sort(function (a, b) {
        return a - b
      })

      console.error(sortedZIndex)

      const newZIndexRequired = sortedZIndex[allZIndex.length - 1] + 1

      // console.log('nya zindex för att vara övers: ', newZIndexRequired)

      // fixa: öka inte z index om samma element väljs igen!

      this.style.zIndex = newZIndexRequired

      console.log('nya z-index', this.style.zIndex)
    }

    /**
     * Method used to move the window element.
     *
     * @param {object} e - An event object.
     */
    moveWindow (e) {
      e.preventDefault() // stoppar markering av text i andra fönster
      // funktionen används när musen flyttas'

      /**
       * Function moves the window element to the new position.
       *
       * @param {object} e - An event object.
       */
      const changeWindowPosition = (e) => {
        // console.log('changes position!')
        e.preventDefault() // stoppar markering av text i andra fönster

        this.posX2 = this.posX1 - e.clientX
        this.posY2 = this.posY1 - e.clientY
        this.posX1 = e.clientX
        this.posY1 = e.clientY

        // console.log(this.posX2, this.posY2)

        // ändrar fönster div positionen
        this.window.style.left = Math.max(this.parentNode.offsetLeft, Math.min((this.window.offsetLeft - this.posX2), (this.parentNode.offsetWidth - this.window.offsetWidth))) + 'px'
        this.window.style.top = Math.max(this.parentNode.offsetTop, Math.min((this.window.offsetTop - this.posY2), (this.parentNode.offsetHeight - this.window.offsetHeight))) + 'px'
      }
      this.posX1 = e.clientX
      this.posY1 = e.clientY

      // Hantera mouseup:
      document.onmouseup = this.disablemoveWindow // gör om till event
      // flyttar elementet:
      document.onmousemove = changeWindowPosition // gör om till event

      /*
      this.windowHeader.addEventListener('mouseleave', () => { // FIXA: mouseleave på window headern fungerar inte
        console.error('Move stopped!')
        this.disablemoveWindow()
        document.onmouseup = null
      })
      */

      this.windowHeader.addEventListener('mouseleave', () => { // stäng av denna i disablemoveWindow !!
        this.leave = true

        /**
         * An event listener function that sets leave to false when the mouse enters the window header.
         */
        const mouseEnter = () => {
          this.leave = false
        }

        this.windowHeader.addEventListener('mouseenter', mouseEnter)

        setTimeout(() => {
          console.error(this.leave)
          if (this.leave === true) {
            console.error('Move stopped!')
            this.disablemoveWindow()
            document.onmouseup = null
          } else {
            console.error('did not leave!')
          }

          this.windowHeader.removeEventListener('mouseenter', mouseEnter)
        }, 50)
      })
    }

    /**
     * A method used to stop a window from moving.
     */
    disablemoveWindow () {
      document.onmousemove = null
    }

    /* ANVÄNDS EJ??
    addElementToWindow () {
      const element = document.createElement(this.windowElement)
      const slot = this.shadowRoot.querySelector('#window')

      slot.appendChild(element)
    }
    */
  }
)
