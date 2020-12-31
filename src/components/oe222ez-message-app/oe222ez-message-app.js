/**
 * Represents a message application.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#messageAppContainer {
    width: 300px;
    height: 300px;
    background-color: lightblue;
}

#createUserNameContainer {
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: orange;
}

#verticalAlign {
  padding-top: 50px;
  width: 100%;
  align-self: center;
}
#chatInterface {
  background-color: yellow;
  width: 100%;
  height: 100%;
}

#messages {
  background-color: pink;
  width: 100%;
  height: 150px;
}

#sendMessage {
  background-color: green;
  width: 100%;
  height: 90px;
}
</style>
<div id="messageAppContainer">
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
`

const chatInterface = document.createElement('template')
chatInterface.innerHTML = `
<div id="chatInterface">
  <h1>messages</h1>
  <div id="messages"></div>
  <div id="sendMessage">
    <input id="sendMessageText" type="text"></input>
    <input id="sendMessageBtn" type="button" value="Send"></input>
  </div>
</div>
`

customElements.define('oe222ez-message-app',
  class extends HTMLElement {

    constructor () {
      super()

      this.username = undefined // användarnamnet

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      return []
    }

    connectedCallback () {
      console.log('message started!')

      const nameInLocStorage = localStorage.getItem('oe222ez-message-app')

      if (nameInLocStorage === null || nameInLocStorage === '') {
        console.log('starts new username!')
        this.createUserName()
      } else {
        this.username = nameInLocStorage
        console.log('user rdy!')
        const chat = this.shadowRoot.querySelector('#messageAppContainer')
        chat.appendChild(chatInterface.content.cloneNode(true))
        this.beginWebSocketConnection()
      }
    }

    attributeChangedCallback (name, oldValue, newValue) {


    }

    disconnectedCallback () {
    }

    createUserName () {
      const container = this.shadowRoot.querySelector('#messageAppContainer')
      container.appendChild(createUserName.content.cloneNode(true))

      this.UsernameListenerFunction = () => {
        // ta bort båda eventlyssnarna!


        console.log('USERNAME CLICK/ENTER')
        const textContent = this.shadowRoot.querySelector('#createNameText').value
        console.log(textContent)

        // lägg till username i locstorage
        localStorage.setItem('oe222ez-message-app', textContent)


        // tar bort create user
        this.shadowRoot.querySelector('#createUserNameContainer').remove()

        // börja om
        this.connectedCallback()
      }

      this.shadowRoot.querySelector('#createNameBtn').addEventListener('click', this.UsernameListenerFunction)
    }

    beginWebSocketConnection () {
      this.webSocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')

      const myJson = {
        "type": "message",
        "data" : "test",
        "username": this.username,
        "channel": "my, not so secret, channel",
        "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
      }
      

      this.webSocket.onopen = (e) => {
        console.log('---onopen----')
        console.log(e)

        setTimeout(() => {
          this.webSocket.send(JSON.stringify(myJson)) // skickar data!
        }, 2000);

        console.log('---onopen----')
      }

      this.webSocket.onmessage = (e) => {
        console.log('---onmessage----')
        console.log(e)
        console.log('---onmessage----')
        this.onMessage(e)

      }

      this.webSocket.onclose = (e) => {
        console.log('---onclose----')
        console.log(e)
        console.log('---onclose----')
      }

      this.webSocket.onerror = (e) => {
        console.log('---onerror----')
        console.error(e)
        console.log('---onerror----')
      }


        // this.webSocket.close() stänger anslutning
    }

    onMessage (e) { // Obs tillfällig lösning! ta bort efter 20meddelanden!
     console.log('onMessage')
     const parseData = JSON.parse(e.data)
     const textElement = document.createElement('p')
     textElement.innerHTML = parseData.data
     const messageContainer = this.shadowRoot.querySelector('#messages')
     messageContainer.appendChild(textElement)
    }
    

  }
)
