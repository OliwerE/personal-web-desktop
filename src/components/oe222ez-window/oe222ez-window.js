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

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Adds the components event listeners.
     */
    connectedCallback () {
      this.style.zIndex = 1 // Default Zindex
      this.setHighestZindex() // Gives this element highest z-index

      // Elements used in this component
      this.window = this.shadowRoot.querySelector('#window')
      this.windowHeader = this.shadowRoot.querySelector('#windowHeader')
      this.closeElementDiv = this.shadowRoot.querySelector('#closeWindowBtn')

      this.style.position = 'absolute'

      // Event listener for the close button
      this.closeElementDiv.addEventListener('click', () => {
        this.remove()

        // Dispatch event when the window is closed
        this.dispatchEvent(new CustomEvent('oe222ez-window-close', {
          detail: { msg: 'fönster stänger!' }
        }))
      })

      this.window.addEventListener('mousedown', this.setHighestZindex.bind(this))

      this.windowHeader.addEventListener('mousedown', this.moveWindow.bind(this))
    }

    /*
    disconnectedCallback () {
      // TA BORT EVENTLYSSNARE!
    }
    */

    /**
     * Method gives this window element the highest z-index.
     */
    setHighestZindex () {
      // Creates array with all window elements
      const zIndexarray = Array.from(this.shadowRoot.host.parentNode.querySelectorAll('oe222ez-window'))

      // Creates array with all z-index values
      const allZIndex = []
      for (let i = 0; i < zIndexarray.length; i++) {
        const zIndexNumber = parseInt(zIndexarray[i].style.zIndex)
        allZIndex.push(zIndexNumber)
      }

      const sortedZIndex = allZIndex.sort(function (a, b) {
        return a - b
      })

      const newZIndexRequired = sortedZIndex[allZIndex.length - 1] + 1 // The new required z-index
      this.style.zIndex = newZIndexRequired
    }

    /**
     * Method used to move the window element.
     *
     * @param {object} e - An event object.
     */
    moveWindow (e) {
      e.preventDefault()

      /**
       * Function moves the window element to the new position.
       *
       * @param {object} e - An event object.
       */
      const changeWindowPosition = (e) => {
        e.preventDefault()

        // Finds window position
        this.posX2 = this.posX1 - e.clientX
        this.posY2 = this.posY1 - e.clientY
        this.posX1 = e.clientX
        this.posY1 = e.clientY

        // Changes window location
        this.window.style.left = Math.max(this.parentNode.offsetLeft, Math.min((this.window.offsetLeft - this.posX2), (this.parentNode.offsetWidth - this.window.offsetWidth))) + 'px'
        this.window.style.top = Math.max(this.parentNode.offsetTop, Math.min((this.window.offsetTop - this.posY2), (this.parentNode.offsetHeight - this.window.offsetHeight))) + 'px'
      }

      // First window position
      this.posX1 = e.clientX
      this.posY1 = e.clientY

      document.onmouseup = this.disablemoveWindow

      document.onmousemove = changeWindowPosition

      /**
       * An eventlisterner function used when the mouse leaves the header with mousedown.
       */
      this.headerLeave = () => {
        this.leave = true

        /**
         * An event listener function that sets leave to false when the mouse enters the window header.
         */
        const mouseEnter = () => {
          this.leave = false
        }

        this.windowHeader.addEventListener('mouseenter', mouseEnter)

        setTimeout(() => { // Ignores false mouse leave events
          if (this.leave === true) {
            this.disablemoveWindow()
            document.onmouseup = null
          }
          this.windowHeader.removeEventListener('mouseenter', mouseEnter)
        }, 50)
      }

      this.windowHeader.addEventListener('mouseleave', this.headerLeave)
      this.headerLeaveEvent = true
    }

    /**
     * A method used to stop a window from moving.
     */
    disablemoveWindow () {
      if (this.headerLeaveEvent === true) { // Removes mouseleave event if active
        this.windowHeader.removeEventListener('mouseleave', this.headerLeave)
        this.headerLeaveEvent = false
      }
      document.onmousemove = null
    }
  }
)
