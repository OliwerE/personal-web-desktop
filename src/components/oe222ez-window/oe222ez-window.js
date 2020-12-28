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
  width: 400px;
  height: 300px;
  background-color: green;
  border: 5px solid;
}

#windowHeader {
  float: left;
  overflow: hidden;
  background-color: orange;
  width: 90%;
  height: 30px;
}
#closeWindowBtn {
  overflow: hidden;
  background-color: red;
  height: 30px;
  width: 10%;
  text-align: center;

}
</style>
<div id="window">
<div id="windowHeader">window header</div>
<div id="closeWindowBtn"></div>

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
      this.windowHeader = this.shadowRoot.querySelector('#windowHeader')
      this.closeElementDiv = this.shadowRoot.querySelector('#closeWindowBtn')
      
      this.closeElementDiv.addEventListener('click', () => {
        //alert('remove div test')
        this.remove()
      })

     this.moveWindow()

    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    disconnectedCallback () {
    }
    
    moveWindow () {
      this.windowHeader.onmousedown = this.mouseDownCoord.bind(this)
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
