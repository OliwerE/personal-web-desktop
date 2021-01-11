/**
 * Represents the memory element.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const styleTemplate = document.createElement('template')
styleTemplate.innerHTML = `
<style>
#memoryStart {
  text-align: center;
}

#memoryContainer {
  background-color: yellow;
  width: 400px;
  max-height: 400px
  display: block;
  margin: 0 auto;
}

h2 {
  font-size: 20px;
}

.memoryBtns {
  width: 125px;
  height: 30px;
  margin-top: 10px;
  background-color: #FDED32;
  border: 2px solid black;
  border-radius: 20px;
}

.memoryBtns:hover, .memoryBtns:focus {
  background-color: #9effff;
}

#highScore {
  text-align: center;
}

#highScore table {
  border-collapse: collapse;
  margin: 0 auto;
}

#highScore td {
  border: 1px solid;
  text-alifgn: center;
  width: 100px;
}

#menuBtn {
  margin-top: 10px;
  width: 100px;
  height: 30px;
}

#lastRoundAttempts {
  margin: 0;
  margin-top: 5px;
}
</style>
 `

const startTemplate = document.createElement('template')
startTemplate.innerHTML = `
<div id="memoryStart">
<h1>Memory</h1>
 <div id="memoryStartBtns">

   <button class="memoryBtns" id="btnSmall">Small (2x2)</button>
   <br>
   <button class="memoryBtns" id="btnMedium">Medium (4x2)</button>
   <br>
   <button class="memoryBtns" id="btnLarge">Large (4x4)</button>
 </div>
 <br>
 <h2>Credits</h2>
 <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
</div>
 `

const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<div id="memory">
<div id="memoryContainer"></div> 
<p id="memoryResult"></p>
</div>
`

const highScoreTemplate = document.createElement('template')
highScoreTemplate.innerHTML = `
<div id="highScore">
  <h1>Top 5 attempts</h1>
  <table>
  <tr>
    <th>Rank</th>
    <th>Attempts</th>
  </tr>
  <tr>
    <td>1</td>
    <td id="rank1"></td>
  </tr>
  <tr>
    <td>2</td>
    <td id="rank2"></td>
  </tr>
  <tr>
    <td>3</td>
    <td id="rank3"></td>
  </tr>
  <tr>
    <td>4</td>
    <td id="rank4"></td>
  </tr>
   <tr>
    <td>5</td>
    <td id="rank5"></td>
  </tr>
</table>
  <p id="lastRoundAttempts">Your attempts: </p>
  <button class="memoryBtns"  id="menuBtn">Menu</button>
</div>
`

customElements.define('oe222ez-memory',
  /**
   * Class represents the custom oe222ez-memory element.
   */
  class extends HTMLElement {
    /**
     * Constructs the custom element.
     */
    constructor () {
      super()

      this._memorySize = 8
      this._createdTileElements = [] // alla tiles före blandning
      this.attemptCounter = 0 // antal försök
      this.foundPairs = [] // array med hittade par

      this.attachShadow({ mode: 'open' })
        .appendChild(styleTemplate.content.cloneNode(true))
    }

    /* ANVÄNDS EJ
    static get observedAttributes () {
      return ['size']
    }
    */

    /**
     * Creates the first page of the component.
     */
    connectedCallback () {
      this.shadowRoot.appendChild(startTemplate.content.cloneNode(true))
      /* flytta till annan metod efter vald storlek!
      this.createTiles()
      this.eventListener()
      */
      // const startMemoryTemplate = this.shadowRoot.querySelector('#memoryStartTemplate', true)

      // const clone = this.shadowRoot.startMemoryTemplate.content.cloneNode(true)

      // this.shadowRoot.appendChild(clone)

      const memoryStartEvent = this.shadowRoot.querySelector('#memoryStartBtns')

      /**
       * Function decides which button was clicked, then starts the correct game size.
       *
       * @param {object} e - The click event object.
       */
      this.memoryStartBtnClicked = (e) => {
        console.log(`test ${e.target.id}`)
        if (e.target.id === 'btnSmall') {
          console.log('SMALL')
          this._memorySize = 4
          this._highScoreList = 4
          // console.error(this._memorySize) // omstart fortf 4
          this.disconnectedCallback() // Removes event listener
          this.startBoard()
        } else if (e.target.id === 'btnMedium') {
          console.log('MEDIUM')
          this._memorySize = 8
          this._highScoreList = 8
          // console.error(this._memorySize)
          this.disconnectedCallback() // Removes event listener
          this.startBoard()
        } else if (e.target.id === 'btnLarge') {
          console.log('LARGE')
          this._memorySize = 16
          this._highScoreList = 16
          // console.error(this._memorySize)
          this.disconnectedCallback() // Removes event listener
          this.startBoard()
        } else {
          console.error('memory start something is wrong with buttons!')
        }
      }

      // obs måste ta bort denna eventlyssnare!!
      memoryStartEvent.addEventListener('click', this.memoryStartBtnClicked)

      /* använd sen!
      const element = document.querySelector('oe222ez-tile')
      element.addEventListener('oe222ez-tile-clicked', (e) => {
      console.log('såg flip från memory komponenten!', e.detail)
      })
      */
    }

    /* ANVÄNDS EJ
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'size') { // memory storlek
        if (newValue === 'small') {
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
    */

    /**
     * Removes all active event listeners.
     */
    disconnectedCallback () {
      // Start menu
      if (this.shadowRoot.querySelector('#memoryStartBtns') !== null) {
        this.shadowRoot.querySelector('#memoryStartBtns').removeEventListener('click', this.memoryStartBtnClicked)
      }

      // Removes memory game event listeners
      if (this.shadowRoot.querySelector('#memoryContainer') !== null) {
        this.removeListener()
      }

      // Removes menu btn listener in high score template
      if (this.shadowRoot.querySelector('#menuBtn') !== null) {
        this.shadowRoot.querySelector('#menuBtn').removeEventListener('click', this.restartListener)
      }
    }

    /**
     * Removes start page and add a memory game template
     * Then calls other methods adding tiles and event listeners.
     */
    startBoard () {
      console.log('---start board ---')

      // ta bort start template

      this.shadowRoot.querySelector('#memoryStart').remove()

      this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true))

      this.createTiles()
      this.addmemoryBoardEventListener()
    }

    /**
     * Creates all tile elements and adds them into an array.
     */
    createTiles () {
      console.log('-------- buildMemoryBoard ------')

      if (this._memorySize === 4) {
        this.shadowRoot.querySelector('#memoryContainer').style.maxWidth = '200px'
      }

      // console.log(numberOfTiles)

      // create tiles in an array:

      const frontImg = './js/components/oe222ez-memory/img/question.png'
      const tileImgLinks = ['./js/components/oe222ez-memory/img/france.png', './js/components/oe222ez-memory/img/ireland.png', './js/components/oe222ez-memory/img/spain.png', './js/components/oe222ez-memory/img/sweden.png', './js/components/oe222ez-memory/img/switzerland.png', './js/components/oe222ez-memory/img/united-kingdom.png', './js/components/oe222ez-memory/img/united-states-of-america.png', './js/components/oe222ez-memory/img/china.png']
      tileImgLinks.sort(() => Math.random() - 0.5) // Shuffle source: https://flaviocopes.com/how-to-shuffle-array-javascript/

      for (let i = 0; i < this._memorySize / 2; i++) {
        console.error('creating tile type: ', i + 1)

        for (let a = 0; a < 2; a++) {
          const newElement = document.createElement('oe222ez-tile')
          newElement.shadowRoot.querySelector('.tile-back').style.backgroundImage = `url('${tileImgLinks[i]}')`
          newElement.shadowRoot.querySelector('.tile-front').style.backgroundImage = `url('${frontImg}')`
          newElement.className = `oe222ez-tile${i + 1}`
          newElement.id = `oe222ez-tile${i + 1}-${a + 1}`
          newElement.setAttribute('tabindex', '0')

          // add front img:

          this._createdTileElements.push(newElement)
        }
      }

      // shuffle nodelist

      console.log(this._createdTileElements)

      const shuffledElements = this._createdTileElements.sort(() => Math.random() - 0.5) // Shuffle source: https://flaviocopes.com/how-to-shuffle-array-javascript/
      this.buildMemoryBoard(shuffledElements)
    }

    /**
     * Method append all shuffled tile elements into the memory container.
     *
     * @param {Array} shuffledElements - All tile elements in an array.
     */
    buildMemoryBoard (shuffledElements) {
      console.log('----- begins buildMemoryBoard -----')

      const container = this.shadowRoot.querySelector('#memoryContainer')

      for (let i = 0; i < shuffledElements.length; i++) {
        container.appendChild(shuffledElements[i])
      }

      console.log(shuffledElements)
    }

    /**
     * Creates event listeners for the memory board.
     */
    addmemoryBoardEventListener () {
      this.boardEventListener = this.shadowRoot.querySelector('#memoryContainer')

      /**
       * An event listener function used to call the tileClick method.
       *
       * @param {object} e - The event object.
       */
      this._eventFunction = (e) => {
        console.log('EVENTFUNCTION!')
        this.tileClick(e.target)
        console.error('------target----')
        console.error(e.target)
        console.error('------target----')
      }

      console.log('-----------listen on board--------')
      const _this = this
      this.boardEventListener.addEventListener('click', _this._eventFunction)

      /**
       * An event listener function used to call _eventFunction with the event object as an argument.
       *
       * @param {object} e - The event object.
       */
      this._eventEnterFunction = (e) => {
        if (e.key === 'Enter') {
          _this._eventFunction(e)
        }
      }

      this.boardEventListener.addEventListener('keypress', _this._eventEnterFunction)
    }

    /**
     * Removes memory board event listeners.
     */
    removeListener () {
      console.log('removes listener!')

      const _this = this
      this.boardEventListener.removeEventListener('click', _this._eventFunction)
      this.boardEventListener.removeEventListener('keypress', _this._eventEnterFunction)
    }

    /**
     * Method is used to find memory tile pairs.
     *
     * @param {Element} newDetail - The clicked element.
     */
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

        this.attemptCounter += 1
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

          // disables tiles
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
          this.addmemoryBoardEventListener() // skapar ny event listener
        }
      } else if (this.lastDetail.className !== newDetail.className) {
        this.attemptCounter += 1
        console.log(this.attemptCounter)
        console.log('WRONG!')

        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')

        this.removeListener()

        // vänd tbx tiles
        await new Promise(resolve => {
          setTimeout(resolve, 1500)
        }).then(() => {
          // this.shadowRoot.querySelector(`#${this.lastDetail.id}`).resetTile()
          // this.shadowRoot.querySelector(`#${newDetail.id}`).resetTile()
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).setAttribute('display', 'front')
          this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'front')
        })

        this.lastDetail = undefined // återställer (tillf. lösn.)

        this.addmemoryBoardEventListener()
      } else {
        console.error('got else!')
      }
    }

    /**
     * Method is called when the last pair is found.
     */
    memoryFinished () {
      this.shadowRoot.querySelector('#memory').remove()

      this.shadowRoot.appendChild(highScoreTemplate.content.cloneNode(true))

      this.getHighScore()

      /**
       * Returns to menu from the high score.
       */
      this.restartListener = () => {
        // tar bort spelet
        this.shadowRoot.querySelector('#highScore').remove()

        // tar bort eventlyssnare
        // this.removeListener()
        this.disconnectedCallback()

        this._createdTileElements = [] // tar bort skapade element!
        this.foundPairs = [] // återställer hittade tiles
        this.attemptCounter = 0
        this._highScoreList = null
        this.connectedCallback() // startar om
      }
      this.shadowRoot.querySelector('#menuBtn').addEventListener('click', this.restartListener)
    }

    /**
     * Creates new local storage object if it doesn't exist.
     * Adds new score to the parsed object and calls next method.
     */
    getHighScore () {
      if (localStorage.getItem('oe222ez-memory') === null) {
        // bygg hela lagrings strukturen
        console.error('hitta inte DATA!')
        const obj = {
          small: [],
          medium: [],
          large: []
        }

        console.error('HITTA STORAGE DATA!')

        const stringObj = JSON.stringify(obj)

        localStorage.setItem('oe222ez-memory', stringObj)
      }

      console.error('-----------------DEUBUG: ', this._highScoreList)

      // väljer resultatobjekt i locstorage:
      let locStorageScores
      if (this._highScoreList === 4) {
        locStorageScores = 'small'
        console.error('VALDE: small')
      } else if (this._highScoreList === 8) {
        locStorageScores = 'medium'
        console.error('VALDE: medium')
      } else if (this._highScoreList === 16) {
        locStorageScores = 'large'
        console.error('VALDE: large')
      }

      // storage data
      const scoreObj = JSON.parse(localStorage.getItem('oe222ez-memory'))
      const currentHighScoreList = scoreObj[locStorageScores]
      console.log(currentHighScoreList) // visar spelstorlekens topplista

      currentHighScoreList.push(this.attemptCounter) // lägger till nya score i storlekens lista

      this.addHighScores(scoreObj, locStorageScores)
    }

    /**
     * Method sort the high score array and keeps five lowest scores.
     * Then saves the scores in local storage and adds them into the high score table.
     *
     * @param {object} scoreObj - An object with three arays for each memory size. Each array index is a score.
     * @param {Array} locStorageScores - The currently used array from scoreObj.
     */
    addHighScores (scoreObj, locStorageScores) {
      const currentHighScoreList = scoreObj[locStorageScores]
      console.error('HIGHSCORES')
      console.error(scoreObj)
      console.error('LISTA: ', locStorageScores)
      /*
      console.error(scoreObj)
      console.error(currentHighScoreList)
      */
      // currentHighScoreList = [4, 5, 3, 2 , 1, 8, 11, 20] // test

      const sortedScores = currentHighScoreList.sort(function (a, b) {
        return a - b
      })

      scoreObj[locStorageScores] = sortedScores.slice(0, 5)

      console.error(sortedScores)
      // console.error(topFiveScores)
      console.error(currentHighScoreList)

      // nya score datan:
      localStorage.setItem('oe222ez-memory', JSON.stringify(scoreObj))

      console.error(scoreObj)
      console.log('---------------')

      console.log(currentHighScoreList)

      console.log('---------------')
      for (let i = 0; i < scoreObj[locStorageScores].length; i++) {
        console.log(i)
        const thisScore = currentHighScoreList[i]
        const element = this.shadowRoot.querySelector(`#rank${i + 1}`)
        const text = document.createTextNode(thisScore)
        element.appendChild(text)
      }

      // Lägger till spelarens poäng
      const lastScore = document.createTextNode(this.attemptCounter)
      this.shadowRoot.querySelector('#lastRoundAttempts').appendChild(lastScore)
    }
  }
)
