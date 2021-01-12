/**
 * Represents a browser desktop environment.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#windowContainer {
    display: block;
    background-color: #ffee33;
    height: calc(100vh - 75px);
    width: 100%;
    margin: 0;
    padding: 0;
}

#dock {
    height: 75px;
    background-color: #9effff;
}
#dockButtonContainer {
  width: 360px;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}
.buttons {
  height: 100%;
  width: 75px;
}
.buttons:active {
  transform: scale(0.9);
}
.buttons:focus {
  /*outline: none;*/
  outline-color: green;
}
.buttons:hover{
  cursor: pointer;
}
#memoryWindow {
  background: url('./js/components/oe222ez-pwd/icons/memoryIcon.png');
}
#messageWindow {
  background: url('./js/components/oe222ez-pwd/icons/messageIcon.png'); /* https://uxwing.com/forum-icon/ */
}
#weatherWindow {
  background: url('./js/components/oe222ez-pwd/icons/weatherIcon.png'); /* https://uxwing.com/day-cloudy-icon/ */
}
</style>
<div id="windowContainer" ">

</div>
<div id="dock">
  <div id="dockButtonContainer">
    <button class="buttons" id="memoryWindow" title="Memory"></button>
    <button class="buttons" id="messageWindow" title="Messages"></button>
    <button class="buttons" id="weatherWindow" title="Weather"></button>
  </div>
</div>
 `

customElements.define('oe222ez-pwd',
  /**
   * Class represents the custom oe222ez-pwd element.
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
     * Method calls a method that adds event listeners to the dock buttons.
     */
    connectedCallback () {
      this.createEventlisteners()
    }

    /**
     * Removes the event listeners.
     */
    disconnectedCallback () {
      this.shadowRoot.querySelector('#memoryWindow').removeEventListener('click', this.memoryClick.bind(this))
      this.shadowRoot.querySelector('#messageWindow').removeEventListener('click', this.messageClick.bind(this))
      this.shadowRoot.querySelector('#weatherWindow').removeEventListener('click', this.weatherClick.bind(this))
    }

    /**
     * Creates the event listeners.
     */
    createEventlisteners () {
      // Event elements
      const memory = this.shadowRoot.querySelector('#memoryWindow')
      const message = this.shadowRoot.querySelector('#messageWindow')
      const weather = this.shadowRoot.querySelector('#weatherWindow')

      // Event listeners
      memory.addEventListener('click', this.memoryClick.bind(this))
      message.addEventListener('click', this.messageClick.bind(this))
      weather.addEventListener('click', this.weatherClick.bind(this))
    }

    /**
     * Creates a new window component in the dom.
     */
    createWindow () {
      const element = document.createElement('oe222ez-window')
      const container = this.shadowRoot.querySelector('#windowContainer')
      container.appendChild(element)
    }

    /**
     * Method adds an element into the new window element.
     *
     * @param {Element} newElement - An element for the window body.
     */
    addWindowContent (newElement) {
      const newWindow = this.shadowRoot.querySelector('#windowContainer').lastChild.shadowRoot.querySelector('#window')
      newWindow.appendChild(newElement)
    }

    /**
     * Creates a new memory window.
     */
    memoryClick () {
      this.createWindow()

      // Adds memory element
      const memoryElement = document.createElement('oe222ez-memory')
      this.addWindowContent(memoryElement)
    }

    /**
     * Creates a new Message window.
     */
    messageClick () {
      this.createWindow()

      // Adds message Element
      const messageElement = document.createElement('oe222ez-message-app')
      this.addWindowContent(messageElement)
    }

    /**
     * Creates a new weather window.
     */
    weatherClick () {
      this.createWindow()

      // Adds Weather element
      const weatherElement = document.createElement('oe222ez-weather')
      this.addWindowContent(weatherElement)
    }
  }
)
