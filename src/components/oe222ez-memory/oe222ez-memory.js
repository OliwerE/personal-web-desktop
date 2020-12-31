/**
 *
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */


const startTemplate = document.createElement('template')
startTemplate.innerHTML = `
 <div id="memoryStart">
 <div id="memoryStartBtns">
 <h1>Memory</h1>
 <button id="btnSmall">Small (2x2)</button>
 <br>
 <button id="btnMedium">Medium (4x2)</button>
 <br>
 <button id="btnLarge">Large (4x4)</button>
 </div>
 <br>
 <h2>Credits</h2>
 <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
 </div>
 `

const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<style>
#memoryContainer {
  background-color: yellow;
  width: 400px;
  max-height: 400px
}

h2 {
  font-size: 20px;
}

</style>
<div id="memoryContainer"></div> 
<p id="memoryResult"></p>
`


customElements.define('oe222ez-memory',
  class extends HTMLElement {

    constructor () {
      super()

      this._memorySize = 8
      this._createdElements = [] // alla tiles före blandning
      this.attemptCounter = 0 // antal försök
      this.foundPairs = [] // array med hittade par

      this.attachShadow({ mode: 'open' })
        .appendChild(startTemplate.content.cloneNode(true))
    }

    static get observedAttributes () {
      return ['size']
    }

    connectedCallback () {

      /* flytta till annan metod efter vald storlek!
      this.createTiles()
      this.eventListener()
      */
     const startMemoryTemplate = this.shadowRoot.querySelector('#memoryStartTemplate', true)


     
      //const clone = this.shadowRoot.startMemoryTemplate.content.cloneNode(true)

      //this.shadowRoot.appendChild(clone)


      const memoryStartEvent = this.shadowRoot.querySelector('#memoryStartBtns')

      this.memoryStartBtnClicked = (e) => {
        console.log(`test ${e.target.id}`)
        if (e.target.id === 'btnSmall') {
          console.log('SMALL')
          this._memorySize = 4
          this.startBoard()
        } else if (e.target.id === 'btnMedium') {
          console.log('MEDIUM')
          this._memorySize = 8
          this.startBoard()
        } else if (e.target.id === 'btnLarge') {
          console.log('LARGE')
          this._memorySize = 16
          this.startBoard()
        } else {
          console.error ('memory start something is wrong with buttons!')
        }
      }

      memoryStartEvent.addEventListener('click', this.memoryStartBtnClicked)




      /* använd sen!
      const element = document.querySelector('oe222ez-tile')

      element.addEventListener('oe222ez-tile-clicked', (e) => {
        console.log('såg flip från memory komponenten!', e.detail)
      })
      */
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'size') { // memory storlek
        if(newValue === 'small') {
          this._memorySize = 4 // behövs egentligen inte!
          console.log('board size: small')
        } else if (newValue === 'medium') {
          this._memorySize = 8
          console.log('board size: medium')
        } else if (newValue === 'large') {
          this._memorySize = 16
          console.log('board size: large')
        }
      }
    }

    disconnectedCallback () {
      console.log('-----memory disconnectedcallback!-----')
    }

    startBoard () {
      console.log('---start board ---')

      // ta bort start template

      this.shadowRoot.querySelector('#memoryStart').remove()

      this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true))


      this.createTiles()
      this.eventListener()
    }

    createTiles () {
      console.log('-------- buildMemoryBoard ------')

      if(this._memorySize === 4) {
        this.shadowRoot.querySelector('#memoryContainer').style.maxWidth = '200px'
      }

      //console.log(numberOfTiles)

      // create tiles in an array:

      for (let i = 1; i <= this._memorySize / 2 ; i++) {
        console.log('creating tile type: ', i + 1)


        for (let a = 1; a <= 2; a++) {
        var newElement = document.createElement('oe222ez-tile')
        newElement.className = `oe222ez-tile${i + 1}`
        newElement.id = `oe222ez-tile${i + 1}-${a + 1}`
        newElement.setAttribute('tabindex', '0')
        this._createdElements.push(newElement)
        }
      }

      // shuffle nodelist

      const shuffledElements = this._createdElements.sort(() => Math.random() - 0.5) //Shuffle source: https://flaviocopes.com/how-to-shuffle-array-javascript/

      this.buildMemoryBoard(shuffledElements)

    }

    buildMemoryBoard (shuffledElements) {
      console.log('----- begins buildMemoryBoard -----')

      const container = this.shadowRoot.querySelector('#memoryContainer')

      for (let i = 0; i < shuffledElements.length; i++) {
        container.appendChild(shuffledElements[i])
      }
      
      
      console.log(shuffledElements)


    }

    eventListener () {

      this.boardEventListener = this.shadowRoot.querySelector('#memoryContainer')

      this._eventFunction = (e) => {
        console.log('EVENTFUNCTION!')
        this.tileClick(e.target)
      }

      console.log('-----------listen on board--------')
      var _this = this
      this.boardEventListener.addEventListener('click', _this._eventFunction)

      this._eventEnterFunction = (e) => {
        if (e.key === 'Enter') {
          _this._eventFunction(e)
        }
      }

      this.boardEventListener.addEventListener('keypress', _this._eventEnterFunction)
    }

    removeListener () {
      console.log('removes listener!')

      var _this = this
      this.boardEventListener.removeEventListener('click', _this._eventFunction)
      this.boardEventListener.removeEventListener('keypress', _this._eventEnterFunction)
    }

 
    async tileClick (newDetail) {
      console.log('---------KLICK----------')
      console.log(newDetail.className)

      for (let i = 0; i < this.foundPairs.length; i++) { // hoppar över redan hittde
        if (newDetail.className === this.foundPairs[i]) {
          console.log('redan hittad!')
          return
        }
      }

      if (this.lastDetail === newDetail) {
        console.log('--clicked same card twice!--')
      } else if (this.lastDetail === undefined) {
        console.log('one card! choose another!')

        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')

        this.lastDetail = newDetail
      } else if (this.lastDetail.className === newDetail.className) {

        this.foundPairs.push(newDetail.className)


        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')

        this.attemptCounter +=1
        console.log(this.attemptCounter)
        console.log('you Found a pair!')
        this.removeListener()

        // gör inaktiva!

                
        // vänd tbx tiles!


        await new Promise(resolve => {
          setTimeout(resolve, 1500)
        }).then(() => {

          // använd nedanför sen ist!
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).removeTileContent()
          this.shadowRoot.querySelector(`#${newDetail.id}`).removeTileContent()

          //disables tiles
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).setAttribute('disabled', 'true')
          this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('disabled', 'true')

          // tar bort tabindex:
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).removeAttribute('tabindex')
          this.shadowRoot.querySelector(`#${newDetail.id}`).removeAttribute('tabindex')
        })
      
        this.lastDetail = undefined // återställer (tillf. lösn.)

        this._memorySize -= 2

        if (this._memorySize === 0) {
          console.log('last pair!')
          this.memoryFinished()
        } else {
          this.eventListener() // skapar ny event listener
        }

      } else if (this.lastDetail.className !== newDetail.className) {
        this.attemptCounter +=1
        console.log(this.attemptCounter)
        console.log('WRONG!')

        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')

        this.removeListener()

        // vänd tbx tiles
        await new Promise(resolve => {
          setTimeout(resolve, 1500)
        }).then(() => {
          //this.shadowRoot.querySelector(`#${this.lastDetail.id}`).resetTile()
          //this.shadowRoot.querySelector(`#${newDetail.id}`).resetTile()
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).setAttribute('display', 'front')
          this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'front')
        })

        this.lastDetail = undefined // återställer (tillf. lösn.)

        this.eventListener()

      } else {
        console.error('got else!')
      }
    }

    memoryFinished () {
      this.shadowRoot.querySelector('#memoryResult').innerHTML = `Number of Attempts: ${this.attemptCounter}`
      // skapa reset knapp
    }

  }
)
