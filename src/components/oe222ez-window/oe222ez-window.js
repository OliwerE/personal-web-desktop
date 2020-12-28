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
  border: 5px solid;
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
      this.window.onmousedown = this.mouseDownCoord.bind(this)
    }

    mouseDownCoord (e) {
      // funktionen används när musen flyttas
      const changeWindowPosition = (e) => {
        console.log('changes position!')
        this.posX2 = this.posX1 - e.clientX
        this.posY2 = this.posY1 - e.clientY
        this.posX1 = e.clientX
        this.posY1 = e.clientY

        console.log(this.posX2, this.posY2)  
        
        // ändrar fönster div positionen
        this.window.style.left = (this.window.offsetLeft - this.posX2) + 'px'
        this.window.style.top = (this.window.offsetTop - this.posY2) + 'px'
      }

      this.posX1 = e.clientX;
      this.posY1 = e.clientY;


      //Hantera mouseup:

      document.onmouseup = this.disablemoveWindow

      // flyttar elementet:
      document.onmousemove = changeWindowPosition
    }

    disablemoveWindow () {
      document.onmousemove = null
    }


    

  }
)
