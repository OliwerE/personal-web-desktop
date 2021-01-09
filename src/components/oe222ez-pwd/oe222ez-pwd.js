/**
 *
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */


const template = document.createElement('template')
template.innerHTML = `
<style>
#windowContainer {
    display: block;
    background-color: orange;
    height: calc(100vh - 75px);
    width: 100%;
    margin: 0;
    padding: 0;
}

#dock {
    height: 75px;
    background-color: #FFFF52;
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
  outline: none;
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
    <button class="buttons" id="memoryWindow"></button>
    <button class="buttons" id="messageWindow"></button>
    <button class="buttons" id="weatherWindow"></button>
  </div>
</div>
 `

customElements.define('oe222ez-pwd',
  class extends HTMLElement {

    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    connectedCallback () {
        this.createEventlisteners()
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('#memoryWindow').removeEventListener('click', this.memoryClick.bind(this))
        this.shadowRoot.querySelector('#messageWindow').removeEventListener('click', this.messageClick.bind(this))
        this.shadowRoot.querySelector('#weatherWindow').removeEventListener('click', this.weatherClick.bind(this))
    }

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

    createWindow () {
      const element = document.createElement('oe222ez-window')
      const container = this.shadowRoot.querySelector('#windowContainer')
      container.appendChild(element)
    }

    addWindowContent (newElement) {
      const newWindow = this.shadowRoot.querySelector('#windowContainer').lastChild.shadowRoot.querySelector('#window')
      newWindow.appendChild(newElement)
    }

    memoryClick () {
      // Window
      this.createWindow()
  
      // Memory component
      const memoryElement = document.createElement('oe222ez-memory')
      this.addWindowContent(memoryElement)
    }

    messageClick () {
      // Window
      this.createWindow()
  
      // message component
      const messageElement = document.createElement('oe222ez-message-app')
      this.addWindowContent(messageElement)
    }

    weatherClick () {
      // Window
      this.createWindow()
  
      // weather component
      const weatherElement = document.createElement('oe222ez-weather')
      this.addWindowContent(weatherElement)
    }

  }
)
