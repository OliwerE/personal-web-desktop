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

#messages {
  background-color: lightgray;
  width: 100%;
  height: 150px;
  overflow-y:auto;
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
</div>
`

const chatInterface = document.createElement('template')
chatInterface.innerHTML = `
<div id="chatInterface">
  <h1>messages</h1>
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


      
      const closeConnection = this.shadowRoot.host.parentNode.parentNode.host //egna window elementet stängs!
      console.error(closeConnection)
      closeConnection.addEventListener('oe222ez-window-close', (e) => {
        console.log('message app ser att  window stänger!', e.detail.msg)
        this.webSocket.close()
      })
      

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

      this.webSocket.onopen = (e) => {
        console.log('---onopen----')
        console.log(e)

        /*
        setTimeout(() => {
          this.webSocket.send(JSON.stringify(myJson)) // skickar data!
        }, 2000);
        */

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

        this.startEventlisteners()
    }

    onMessage (e) {
     console.log('onMessage')
     const parseData = JSON.parse(e.data)

    console.error(parseData)

     const textElement = document.createElement('p')

     var username
     if (parseData.username === '') {
      username = 'Undefined'
     } else {
       username = parseData.username
     }

     textElement.innerHTML = `${username}: ` + parseData.data
     const messageContainer = this.shadowRoot.querySelector('#messages')
     messageContainer.appendChild(textElement)

     messageContainer.scrollTop = messageContainer.scrollHeight // visar alltid längst ner i message div
    
    if (messageContainer.childNodes.length > 25) {
      console.log('more than 25 messages! removes first message!')
      messageContainer.firstChild.remove()
    }
    }

    startEventlisteners () {
      console.log('----- starts eventlisteners! -----')


      this.eventListernerKeypress = (e) => {
        if(e.key === 'Enter') {
          console.log('---sends message!---')
          this.sendMessage()
        }
      }
      const textField = this.shadowRoot.querySelector('#sendMessageText')
      textField.addEventListener('keypress', this.eventListernerKeypress)


      const btn = this.shadowRoot.querySelector('#sendMessageBtn')

      this.eventListernerBtn = () => {
        console.log('---sends message!---')
        this.sendMessage()
      }
      btn.addEventListener('click', this.eventListernerBtn)

    }

    sendMessage () {
      console.log('----starts send message ----')


      // hämta data

      const input = this.shadowRoot.querySelector('#sendMessageText')

      const data = {
        "type": "message",
        "data" : input.value,
        "username": this.username,
        "channel": "my, not so secret, channel",
        "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
      }

      this.webSocket.send(JSON.stringify(data)) // skickar data!

      // ta bort text från input

    }
    

  }
)
