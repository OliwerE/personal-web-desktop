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
      this.window.onmousedown = this.mouseDownCoord.bind(this)
    }

    mouseDownCoord (e) {
      console.log(this.window)
      // funktionen används när musen flyttas
      const changeWindowPosition = (e) => {
        console.log('changes position!')
        this.posX2 = e.clientX
        this.posY2 = e.clientY
        console.log(this.posX2, this.posY2)
        
        // nya koordinater:

        var newX = this.posX1 - this.posX2
        var newY = this.posY1 - this.posY2

        console.log('new x & y: ', newX, newY)

        /*
        // nolställer alla gamla positioner (fixa bättre lösning??)
        this.posX1 = 0
        this.posX2 = 0
        this.posY1 = 0
        this.posY2 = 0
        */


        // ändra div positionen:

        //console.error(this.window) // löst anv: .bind(this)
        
        
        this.window.style.top = (this.window.offsetTop - newY) + 'px'
        this.window.style.left = (this.window.offsetLeft - newX) + 'px'
      
      }
      // stoppa event onmouseup och onmousemove!


      // när fönstret flyttas:
      this.posX1 = e.clientX
      this.posY1 = e.clientY
      
      // hantera mouseup!

      console.log(this.posX1, this.posY1)
      document.onmousemove = changeWindowPosition




    }


    

  }
)
