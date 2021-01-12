/**
 * Represents a message application.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
h1 {
  text-align: center;
}
#messageAppContainer {
    width: 100%;
    height: 300px;
}

#createUserNameContainer {
  width: 100%;
  height: 100%;
  text-align: center;
}

#verticalAlign {
  padding-top: 50px;
  width: 100%;
  align-self: center;
}
#chatInterface {
  width: 100%;
  height: 100%;
}

#chatInterface h1 {
  margin: 0;
}

#messages {
  background-color: lightgray;
  width: 100%;
  height: 150px;
  overflow-y:auto;
}

#messages p {
  float: left;
  background-color: #9effff;
  width: 75%;
  border: 1px solid;
  border-radius: 5px;
  margin-left: 5px;
  margin-top: 5px;
  margin-bottom: 0px;
}

#sendMessage {
  height: 60px;
}

#sendMessageBtn {
  width: 90px;
  height: 30px;
  border-radius: 10px;
}

#sendMessageText {
  width: 250px;
  max-width: 280px;
  height: 50px;
  max-height: 70px;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 10px;
}

#textAreaDiv {
  float: left;
  width: 300px;
  height: 100%;

}

#sendBtnDiv {
  float: left;
  width: 100px;
  height: 100%;
  margin-top: 30px;
}

/* start menu  */

#startDiv {
  text-align: center;
}

#allChannels {
  text-align: center;
  margin-bottom: 10px;
}

#changeUsername {
  margin-top: 20px;
  text-align: center;
}

startDiv, h2 {
  margin: 0;
  margin-bottom: 10px;
}
</style>
<div id="messageAppContainer">
</div>
`

const startTemplate = document.createElement('template')
startTemplate.innerHTML = `
<div id="startDiv">
  <h1>Message application</h1>
  <input id="allChannels" type="button" value="All channels">
  <br>
  <h2>Join a private channel</h2>
  <input id="privateChannelText" type="text" placeholder="Channel name"/>
  <input id="privateChannel" type="button" value="Start channel"/>
  <br>
  <input id="changeUsername" type="button" value="Change username">
</div>
`

const createUserName = document.createElement('template')
createUserName.innerHTML = `
<div id="createUserNameContainer">
  <div id="verticalAlign">
    <h1>Create Username</h1>
      <input id="createNameText" type="text"></input>
      <input id="createNameBtn" type="button" value="Submit"></input>
    </div>
  </div>
</div>
`

const chatInterface = document.createElement('template')
chatInterface.innerHTML = `
<div id="chatInterface">
  <h1>Messages</h1>
  <div id="messagesHeader">
    <button id="backButton">Menu</button>
    <p id="currentChannel">Channel: </p>
  </div>
  <div id="messages"></div>
  <div id="sendMessage">
  <div id="textAreaDiv">
    <textarea id="sendMessageText" type="text"></textarea>
  </div>
  <div id="sendBtnDiv">
      <input id="sendMessageBtn" type="button" value="Send"/>
  </div>
  </div>
</div>
`

customElements.define('oe222ez-message-app',
  /**
   * Class represents the custom oe222ez-message-app element.
   */
  class extends HTMLElement {
    /**
     * Constructs the custom element.
     */
    constructor () {
      super()

      this.closeEvent = false // If the window close event listener is on or of
      this.username = undefined
      this.channel = ''
      this.privateChannel = false // Only listens on a specific channel if true.
      this.webSocketConnection = false

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Method starts create username page if username doesn't exist
     * If username exist in storage the menu page is loaded.
     */
    connectedCallback () {
      this.username = localStorage.getItem('oe222ez-message-app')

      if (this.username === null || this.username === '') { // If username doesnt exist
        this.disconnectedCallback() // Resets event listeners
        this.createUserName()
      } else {
        const container = this.shadowRoot.querySelector('#messageAppContainer')
        container.appendChild(startTemplate.content.cloneNode(true))

        // event lyssnare för knapparna!
        /**
         * An event listener function used to decide what to do based on which button was clicked.
         *
         * @param {object} e - The event object.
         */
        this.startMenuEvent = (e) => {
          if (e.target.id === 'allChannels') {
            this.privateChannel = false
            this.shadowRoot.querySelector('#startDiv').remove()
            this.disconnectedCallback() // Resets event listeners
            const chat = this.shadowRoot.querySelector('#messageAppContainer')
            chat.appendChild(chatInterface.content.cloneNode(true))
            this.setChannelName() // Displays channel name
            this.beginWebSocketConnection()
          } else if (e.target.id === 'changeUsername') { // Start change username
            this.shadowRoot.querySelector('#startDiv').remove()
            this.disconnectedCallback()
            this.createUserName()
          } else if (e.target.id === 'privateChannel') {
            this.disconnectedCallback()
            this.startPrivateChannel()
          }
        }

        this.shadowRoot.querySelector('#startDiv').addEventListener('click', this.startMenuEvent)

        /**
         * An event listener function used to start a private channel with enter.
         *
         * @param {object} e - An event object.
         */
        this.startPrivateChannelEnter = (e) => {
          if (e.key === 'Enter') {
            this.disconnectedCallback() // Resets event listeners
            this.startPrivateChannel()
          }
        }

        this.shadowRoot.querySelector('#privateChannelText').addEventListener('keypress', this.startPrivateChannelEnter)
      }
    }

    /**
     * Method removes active event listeners.
     */
    disconnectedCallback () {
      // start template
      if (this.shadowRoot.querySelector('#startDiv') !== null) {
        this.shadowRoot.querySelector('#startDiv').removeEventListener('click', this.startMenuEvent)
      }
      if (this.shadowRoot.querySelector('#privateChannelText') !== null) {
        this.shadowRoot.querySelector('#privateChannelText').removeEventListener('keypress', this.startPrivateChannelEnter)
      }

      // Change username window
      if (this.shadowRoot.querySelector('#createNameBtn') !== null) {
        this.shadowRoot.querySelector('#createNameBtn').removeEventListener('click', this.UsernameListenerFunction)
      }
      if (this.shadowRoot.querySelector('#createNameText') !== null) {
        this.shadowRoot.querySelector('#createNameText').removeEventListener('keypress', this.createNameKeypress)
      }

      // window close event
      if (this.closeEvent === true) {
        setTimeout(() => { // Timeout used to close the connection before the event listener is removed
          this.closeConnection.removeEventListener('oe222ez-window-close', this.windowClosedEvent)
          this.closeEvent = false
        }, 10)
      }

      // Message template
      if (this.shadowRoot.querySelector('#sendMessageText') !== null) {
        this.shadowRoot.querySelector('#sendMessageText').removeEventListener('keypress', this.eventListernerKeypress)
      }

      if (this.shadowRoot.querySelector('#sendMessageBtn') !== null) {
        this.shadowRoot.querySelector('#sendMessageBtn').removeEventListener('click', this.eventListernerBtn)
      }

      if (this.shadowRoot.querySelector('#backButton') !== null) {
        this.shadowRoot.querySelector('#backButton').removeEventListener('click', this.eventListenerMenuBtn)
      }
    }

    /**
     * Method loads username template and saves user input as the new nickname.
     */
    createUserName () {
      const container = this.shadowRoot.querySelector('#messageAppContainer')
      container.appendChild(createUserName.content.cloneNode(true))

      /**
       * An event listener function used to set input value as new username and load menu template.
       */
      this.UsernameListenerFunction = () => {
        this.disconnectedCallback() // Removes event listeners
        const textContent = this.shadowRoot.querySelector('#createNameText').value
        localStorage.setItem('oe222ez-message-app', textContent) // Adds username in local storage

        this.shadowRoot.querySelector('#createUserNameContainer').remove()

        this.connectedCallback() // Restarts application
      }

      this.shadowRoot.querySelector('#createNameBtn').addEventListener('click', this.UsernameListenerFunction)

      /**
       * An eventlistener function used to decide if enter was pressed.
       * If enter was pressed another function is called.
       *
       * @param {object} e - The event object.
       */
      this.createNameKeypress = (e) => {
        if (e.key === 'Enter') {
          this.UsernameListenerFunction() // Calls the button event listener function
        }
      }

      this.shadowRoot.querySelector('#createNameText').addEventListener('keypress', this.createNameKeypress)
    }

    /**
     * A method used to set the name of the current channel.
     */
    setChannelName () {
      let channel
      if (this.channel === '') { // If the private channel is an empty string
        channel = 'All channels'
      } else { // If the private channel input has a value
        channel = this.channel
      }
      const channelTextNode = document.createTextNode(channel)
      const element = this.shadowRoot.querySelector('#currentChannel')
      element.appendChild(channelTextNode)
    }

    /**
     * Used to start a private channel.
     */
    startPrivateChannel () {
      this.privateChannel = true
      this.channel = this.shadowRoot.querySelector('#privateChannelText').value

      // starts chat page
      this.shadowRoot.querySelector('#startDiv').remove()
      const chat = this.shadowRoot.querySelector('#messageAppContainer')
      chat.appendChild(chatInterface.content.cloneNode(true))

      this.setChannelName()
      this.beginWebSocketConnection()
    }

    /**
     * Starts a new websocket connection.
     */
    beginWebSocketConnection () {
      this.webSocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')

      /**
       * Function called when the websocket connection is opened.
       *
       * @param {object} e - A response object.
       */
      this.webSocket.onopen = (e) => {
        this.webSocketConnection = true
      }

      /**
       * Function called when the client receives a message from the server.
       *
       * @param {object} e - A response object.
       */
      this.webSocket.onmessage = (e) => {
        this.onMessage(e)
      }

      /**
       * Function called when the websocket connection is closed.
       *
       * @param {object} e - A response object.
       */
      this.webSocket.onclose = (e) => {
        if (this.webSocketConnection === true) { // If the connection is closed from the server
          this.webSocketConnection = false
          const message = {
            data: 'You have been disconnected!',
            username: 'The Server'
          }
          this.displayMessage(message)
        }
      }

      /**
       * Function called when something is wrong with the websocket.
       *
       * @param {object} e - A response object.
       */
      this.webSocket.onerror = (e) => {
        console.error(e)
      }

      /**
       * Function is called when the eventlisteners custom event is dispatched by the window components close window button.
       *
       * @param {object} e - An event object.
       */
      this.windowClosedEvent = (e) => {
        this.webSocket.close()
        this.webSocketConnection = false
      }

      // Listens for the window components close event.
      this.closeConnection = this.shadowRoot.host.parentNode.parentNode.host
      this.closeConnection.addEventListener('oe222ez-window-close', this.windowClosedEvent)
      this.closeEvent = true

      this.startMessageEventlisteners()
    }

    /**
     * Starts chat event listeners.
     */
    startMessageEventlisteners () {
      /**
       * An event listener function used when a key is pressed in the textarea.
       *
       * @param {object} e - An event object.
       */
      this.eventListernerKeypress = (e) => {
        if (e.key === 'Enter') {
          this.sendMessage()
        }
      }
      const textField = this.shadowRoot.querySelector('#sendMessageText')
      textField.addEventListener('keypress', this.eventListernerKeypress)

      /**
       * An event listener function used when the send message button is clicked.
       */
      this.eventListernerBtn = () => {
        this.sendMessage()
      }
      const sendBtn = this.shadowRoot.querySelector('#sendMessageBtn')
      sendBtn.addEventListener('click', this.eventListernerBtn)

      /**
       * An event listener function used when the menu button is clicked.
       */
      this.eventListenerMenuBtn = () => {
        this.webSocket.close()
        this.webSocketConnection = false

        this.shadowRoot.querySelector('#chatInterface').remove()
        this.disconnectedCallback() // Removes event listeners
        this.connectedCallback() // Returns to menu
      }
      const menuBtn = this.shadowRoot.querySelector('#backButton')
      menuBtn.addEventListener('click', this.eventListenerMenuBtn)
    }

    /**
     * Method called when the websocket server sends a message.
     *
     * @param {object} e - A websocket response.
     */
    onMessage (e) {
      const parseData = JSON.parse(e.data)

      if (this.privateChannel === false) {
        this.displayMessage(parseData)
      } else if (this.privateChannel === true) {
        if (parseData.channel === this.channel || parseData.type === 'notification') { // Displays messages from one channel and server notifications
          this.displayMessage(parseData)
        }
      }
    }

    /**
     * Adds the new message in the chat window.
     *
     * @param {object} parseData - A data object from the websocket server
     */
    displayMessage (parseData) {
      const textElement = document.createElement('p')

      let username
      if (parseData.username === '') { // If a username does not exist
        username = 'Undefined'
      } else if (parseData.username === this.username) { // If it is the users own username
        username = 'You'
        textElement.setAttribute('style', 'float: right; background-color: #FDED32;') // eget meddelande
      } else { // If the message is from someone else
        username = parseData.username
      }

      const newText = document.createTextNode(`${username}: ` + parseData.data)
      textElement.appendChild(newText)

      const messageContainer = this.shadowRoot.querySelector('#messages')
      messageContainer.appendChild(textElement)

      messageContainer.scrollTop = messageContainer.scrollHeight // Displays bottom of the message container

      if (messageContainer.childNodes.length > 25) { // Removes oldest message if the message container has more than 25 messages
        messageContainer.firstChild.remove()
      }
    }

    /**
     * Sends a message to the websocket server.
     */
    sendMessage () {
      const input = this.shadowRoot.querySelector('#sendMessageText')

      if (input.value !== '') { // If the text area is not an empty string
        const data = {
          type: 'message',
          data: input.value,
          username: this.username,
          channel: this.channel,
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }

        this.webSocket.send(JSON.stringify(data))
        this.shadowRoot.querySelector('#sendMessageText').value = '' // Removes last message from text area
      }
    }
  }
)
