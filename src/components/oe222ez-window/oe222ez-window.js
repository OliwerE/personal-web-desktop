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
  <slot id="windowSlot" name="application"></slot>
</div>

`

customElements.define('oe222ez-window',
  class extends HTMLElement {

    constructor () {
      super()

      this.windowElement = undefined

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      return ['windowElement']
    }

    connectedCallback () {
      console.log('A window component added to dom!')

      // Element som används i komponenten
      this.window = this.shadowRoot.querySelector('#window')
      this.windowHeader = this.shadowRoot.querySelector('#windowHeader')
      this.closeElementDiv = this.shadowRoot.querySelector('#closeWindowBtn')

      // sätter default zIndex
      this.style.zIndex = 1
      this.style.position = 'absolute'

      // event lyssnare för stäng knappen
      this.closeElementDiv.addEventListener('click', () => {
        this.remove()
      })

      // move window metod (gör om en metod för mkt!)
      this.moveWindow()
      
      this.window.addEventListener('click', () => { // flytta funktionen till egen metod!
        
        console.log('Nuvarane zindex: ', this.style.zIndex)
        
        
        // skapar en array med alla element i domen
        const zIndexarray = Array.from(document.querySelectorAll('oe222ez-window'))
        
        console.log(zIndexarray)
        
        
        // loopar igenom alla window element och loggar
        let allZIndex = []
        for (let i = 0; i < zIndexarray.length; i++) {
            let zIndexNumber = parseInt(zIndexarray[i].style.zIndex)

            console.log('loop: ', zIndexNumber)

            allZIndex.push(zIndexNumber)
        }

        
        var sortedZIndex = allZIndex.sort(function(a, b) {
          return a - b
        })

        console.log(sortedZIndex)

        
        var newZIndexRequired = sortedZIndex[allZIndex.length - 1] + 1

        
        //console.log('nya zindex för att vara övers: ', newZIndexRequired)


        // fixa: öka inte z index om samma element väljs igen!

          this.style.zIndex = newZIndexRequired

        console.log(this.style.zIndex)
      })


    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'windowElement') { // kontrollera att detta är ett element:  <namn>
        console.log('window edit!')
        this.windowElement = newValue
        this.addElementToWindow()
      }

    }

    disconnectedCallback () {
    }
    
    moveWindow () {
      this.windowHeader.onmousedown = this.mouseDownCoord.bind(this)
    }

    mouseDownCoord (e) {
      // funktionen används när musen flyttas'
      const changeWindowPosition = (e) => {
        //console.log('changes position!')
        e.preventDefault() // stoppar markering av text i andra fönster

        this.posX2 = this.posX1 - e.clientX
        this.posY2 = this.posY1 - e.clientY
        this.posX1 = e.clientX
        this.posY1 = e.clientY

        //console.log(this.posX2, this.posY2)

        // ändrar fönster div positionen
        this.window.style.left = Math.max(this.parentNode.offsetLeft, Math.min((this.window.offsetLeft - this.posX2), (this.parentNode.offsetWidth - this.window.offsetWidth )))  + 'px'
        this.window.style.top = Math.max(this.parentNode.offsetTop, Math.min((this.window.offsetTop - this.posY2), (this.parentNode.offsetHeight - this.window.offsetHeight ))) + 'px'
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

    addElementToWindow () {
      const element = document.createElement(this.windowElement)
      const slot = this.shadowRoot.querySelector('#window')

      slot.appendChild(element)
    }
    

  }
)
