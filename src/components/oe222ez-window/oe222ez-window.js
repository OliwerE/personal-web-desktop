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
      console.log('A window component added to dom!')
      this.window = this.shadowRoot.querySelector('#window')
      
     this.moveWindow()

    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    disconnectedCallback () {
    }
    
    moveWindow () {
      this.window.onmousedown = this.mouseDownCoord
    }

    mouseDownCoord (e) {

      // stoppa event onmouseup och onmousemove!



      // när fönstret flyttas:

      this.posX1 = e.pageX
      this.posY1 = e.pageY
      //document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      console.log(this.posX1, this.posY1)
      document.onmousemove = changeWindowPosition

      function changeWindowPosition () {
        console.log('changes position!')
      }

    }


    

  }
)
