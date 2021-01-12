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

      this._createdTileElements = [] // The tile elements before they are added to the dom.
      this.attemptCounter = 0
      this.foundPairs = []

      this.attachShadow({ mode: 'open' })
        .appendChild(styleTemplate.content.cloneNode(true))
    }

    /**
     * Creates the first page of the component.
     */
    connectedCallback () {
      this.shadowRoot.appendChild(startTemplate.content.cloneNode(true))
      const memoryStartEvent = this.shadowRoot.querySelector('#memoryStartBtns')

      /**
       * Function decides which button was clicked, then starts the correct game size.
       *
       * @param {object} e - The click event object.
       */
      this.memoryStartBtnClicked = (e) => {
        if (e.target.id === 'btnSmall') {
          this._memorySize = 4
          this._highScoreList = 4 
          this.disconnectedCallback() // Removes event listener
          this.startBoard()
        } else if (e.target.id === 'btnMedium') {
          this._memorySize = 8
          this._highScoreList = 8
          this.disconnectedCallback()
          this.startBoard()
        } else if (e.target.id === 'btnLarge') {
          this._memorySize = 16
          this._highScoreList = 16
          this.disconnectedCallback()
          this.startBoard()
        } else {
          console.error('Memory start: Button listener did not find an alternative!')
        }
      }

      memoryStartEvent.addEventListener('click', this.memoryStartBtnClicked)
    }

    /**
     * Removes all active event listeners.
     */
    disconnectedCallback () {
      // Removes start menu event listener (buttons)
      if (this.shadowRoot.querySelector('#memoryStartBtns') !== null) {
        this.shadowRoot.querySelector('#memoryStartBtns').removeEventListener('click', this.memoryStartBtnClicked)
      }

      // Removes memory game event listeners
      if (this.shadowRoot.querySelector('#memoryContainer') !== null) {
        this.removeListener()
      }

      // Removes menu btn listener in the high score template
      if (this.shadowRoot.querySelector('#menuBtn') !== null) {
        this.shadowRoot.querySelector('#menuBtn').removeEventListener('click', this.restartListener)
      }
    }

    /**
     * Removes start page and add a memory game template
     * Then calls other methods adding tiles and event listeners.
     */
    startBoard () {
      this.shadowRoot.querySelector('#memoryStart').remove() // Removes start menu

      this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true))

      this.createTiles()
      this.addmemoryBoardEventListener()
    }

    /**
     * Creates all tile elements and adds them into an array.
     */
    createTiles () {
      if (this._memorySize === 4) { // Changes memory width if the selected board size is small
        this.shadowRoot.querySelector('#memoryContainer').style.maxWidth = '200px'
      }

      const frontImg = './js/components/oe222ez-memory/img/question.png'
      const tileImgLinks = ['./js/components/oe222ez-memory/img/france.png', './js/components/oe222ez-memory/img/ireland.png', './js/components/oe222ez-memory/img/spain.png', './js/components/oe222ez-memory/img/sweden.png', './js/components/oe222ez-memory/img/switzerland.png', './js/components/oe222ez-memory/img/united-kingdom.png', './js/components/oe222ez-memory/img/united-states-of-america.png', './js/components/oe222ez-memory/img/china.png']
      tileImgLinks.sort(() => Math.random() - 0.5) // Shuffle source: https://flaviocopes.com/how-to-shuffle-array-javascript/

      for (let i = 0; i < this._memorySize / 2; i++) { // Creates all memory tiles.
        for (let a = 0; a < 2; a++) { // Creates tile pairs.
          const newElement = document.createElement('oe222ez-tile')
          newElement.shadowRoot.querySelector('.tile-back').style.backgroundImage = `url('${tileImgLinks[i]}')`
          newElement.shadowRoot.querySelector('.tile-front').style.backgroundImage = `url('${frontImg}')`
          newElement.className = `oe222ez-tile${i + 1}` // Used to find pairs.
          newElement.id = `oe222ez-tile${i + 1}-${a + 1}`
          newElement.setAttribute('tabindex', '0')

          this._createdTileElements.push(newElement) // Adds tile element into an array.
        }
      }

      // Shuffles the tile elements.
      const shuffledElements = this._createdTileElements.sort(() => Math.random() - 0.5) // Shuffle source: https://flaviocopes.com/how-to-shuffle-array-javascript/
      this.buildMemoryBoard(shuffledElements)
    }

    /**
     * Method append all shuffled tile elements into the memory container.
     *
     * @param {Array} shuffledElements - All tile elements in an array.
     */
    buildMemoryBoard (shuffledElements) {
      const container = this.shadowRoot.querySelector('#memoryContainer')

      for (let i = 0; i < shuffledElements.length; i++) {
        container.appendChild(shuffledElements[i])
      }
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
        this.tileClick(e.target)
      }

      this.boardEventListener.addEventListener('click', this._eventFunction)

      /**
       * An event listener function used to call _eventFunction with the event object as an argument.
       *
       * @param {object} e - The event object.
       */
      this._eventEnterFunction = (e) => {
        if (e.key === 'Enter') {
          this._eventFunction(e)
        }
      }

      this.boardEventListener.addEventListener('keypress', this._eventEnterFunction)
    }

    /**
     * Removes memory board event listeners.
     */
    removeListener () {
      this.boardEventListener.removeEventListener('click', this._eventFunction)
      this.boardEventListener.removeEventListener('keypress', this._eventEnterFunction)
    }

    /**
     * Method is used to find memory tile pairs.
     *
     * @param {Element} newDetail - The clicked element.
     */
    async tileClick (newDetail) {
      for (let i = 0; i < this.foundPairs.length; i++) { // If the class pair is already found
        if (newDetail.className === this.foundPairs[i]) {
          return
        }
      }

      if (this.lastDetail === newDetail) { // If the same tile is clicked twice
        return
      } else if (this.lastDetail === undefined) { // If the clicked tile is the first tile
        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')
        this.lastDetail = newDetail
      } else if (this.lastDetail.className === newDetail.className) { // If the tiles is a pair
        this.foundPairs.push(newDetail.className)
        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')
        this.attemptCounter += 1
        this.removeListener()

        await new Promise(resolve => {
          setTimeout(resolve, 1500)
        }).then(() => {
          // Makes the tiles invisible
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).removeTileContent()
          this.shadowRoot.querySelector(`#${newDetail.id}`).removeTileContent()
          
          // Removes tabindex
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).removeAttribute('tabindex')
          this.shadowRoot.querySelector(`#${newDetail.id}`).removeAttribute('tabindex')
        })

        this.lastDetail = undefined
        this._memorySize -= 2

        if (this._memorySize === 0) {
          this.memoryFinished()
        } else {
          this.addmemoryBoardEventListener() // Reactivates event listeners
        }
      } else if (this.lastDetail.className !== newDetail.className) { // If the tiles does not match
        this.attemptCounter += 1
        this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'back')
        this.removeListener()

        await new Promise(resolve => {
          setTimeout(resolve, 1500)
        }).then(() => {
          // Turns tiles to the front side.
          this.shadowRoot.querySelector(`#${this.lastDetail.id}`).setAttribute('display', 'front')
          this.shadowRoot.querySelector(`#${newDetail.id}`).setAttribute('display', 'front')
        })

        this.lastDetail = undefined
        this.addmemoryBoardEventListener() // Reactivates event listeners
      } else {
        console.error('Could not find a matching if statement for the tile click event.')
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
       * An event listener function used to return to menu from the high score.
       */
      this.restartListener = () => {
        this.shadowRoot.querySelector('#highScore').remove()
        this.disconnectedCallback() // Removes event listeners

        // Resets values
        this._createdTileElements = []
        this.foundPairs = []
        this.attemptCounter = 0
        this._highScoreList = null

        this.connectedCallback() // Restart
      }
      this.shadowRoot.querySelector('#menuBtn').addEventListener('click', this.restartListener)
    }

    /**
     * Creates new local storage object if it doesn't exist.
     * Adds new score to the parsed object and calls next method.
     */
    getHighScore () {
      if (localStorage.getItem('oe222ez-memory') === null) { // Creates new local storage object if it does not exist
        const obj = {
          small: [],
          medium: [],
          large: []
        }
        const stringObj = JSON.stringify(obj)
        localStorage.setItem('oe222ez-memory', stringObj)
      }

      // Sets variable to the correct memory size high score
      let locStorageScores
      if (this._highScoreList === 4) {
        locStorageScores = 'small'
      } else if (this._highScoreList === 8) {
        locStorageScores = 'medium'
      } else if (this._highScoreList === 16) {
        locStorageScores = 'large'
      }

      // Gets high score from local storage
      const scoreObj = JSON.parse(localStorage.getItem('oe222ez-memory'))
      const currentHighScoreList = scoreObj[locStorageScores]


      currentHighScoreList.push(this.attemptCounter) // Adds new score to current score array

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
      const sortedScores = currentHighScoreList.sort(function (a, b) {
        return a - b
      })
      scoreObj[locStorageScores] = sortedScores.slice(0, 5) // keep top five scores.

      localStorage.setItem('oe222ez-memory', JSON.stringify(scoreObj)) // New high score data

      // Adds top five scores in a table
      for (let i = 0; i < scoreObj[locStorageScores].length; i++) {
        console.log(i)
        const thisScore = currentHighScoreList[i]
        const element = this.shadowRoot.querySelector(`#rank${i + 1}`)
        const text = document.createTextNode(thisScore)
        element.appendChild(text)
      }

      // Displays the players score
      const lastScore = document.createTextNode(this.attemptCounter)
      this.shadowRoot.querySelector('#lastRoundAttempts').appendChild(lastScore)
    }
  }
)
