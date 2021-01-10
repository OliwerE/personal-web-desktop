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
  class extends HTMLElement {

    constructor () {
      super()

      this.closeEvent = false // används för att avgöra om window close eventet är på eller av
      this.username = undefined // användarnamnet
      this.channel = ''
      this.privateChannel = false // returnerar data från alla kanaler (om false)
      this.webSocketConnection = false

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      return []
    }

    connectedCallback () {
      console.log('message started!')

      this.username = localStorage.getItem('oe222ez-message-app')

      if (this.username === null || this.username === '') {
        console.log('starts new username!')

        this.disconnectedCallback() // återställer eventlyssnare

        this.createUserName()
      } else {
        const container = this.shadowRoot.querySelector('#messageAppContainer')
        container.appendChild(startTemplate.content.cloneNode(true))

        // event lyssnare för knapparna!
        this.startMenuEvent = (e) => {
          console.error (e.target.id)

          if (e.target.id === 'allChannels') {
            this.privateChannel = false
            this.shadowRoot.querySelector('#startDiv').remove()

            this.disconnectedCallback() // återställer eventlyssnare
            console.log('user rdy!')
            const chat = this.shadowRoot.querySelector('#messageAppContainer')
            chat.appendChild(chatInterface.content.cloneNode(true))

            // display channel
            this.setChannelName()

            this.beginWebSocketConnection()
          } else if (e.target.id === 'changeUsername') {
            this.shadowRoot.querySelector('#startDiv').remove()
            console.log('starts CHANGE username')

            this.disconnectedCallback() // återställer eventlyssnare

            this.createUserName()
          } else if (e.target.id === 'privateChannel') {
            this.disconnectedCallback() // återställer eventlyssnare
            this.startPrivateChannel()
          }
        }

        this.shadowRoot.querySelector('#startDiv').addEventListener('click', this.startMenuEvent)


        this.startPrivateChannelEnter = (e) => {
          if (e.key === 'Enter') {
            this.disconnectedCallback()
            this.startPrivateChannel()
          }

        }

        this.shadowRoot.querySelector('#privateChannelText').addEventListener('keypress', this.startPrivateChannelEnter)
      }
    }

    attributeChangedCallback (name, oldValue, newValue) {


    }

    disconnectedCallback () {

      //start template
      if (this.shadowRoot.querySelector('#startDiv') !== null) {
        this.shadowRoot.querySelector('#startDiv').removeEventListener('click', this.startMenuEvent)
      }

      if (this.shadowRoot.querySelector('#privateChannelText') !== null) {
        this.shadowRoot.querySelector('#privateChannelText').removeEventListener('keypress', this.startPrivateChannelEnter)
      }  

      // ändra namn

      if (this.shadowRoot.querySelector('#createNameBtn') !== null) {
        this.shadowRoot.querySelector('#createNameBtn').removeEventListener('click', this.UsernameListenerFunction)
      }

      if (this.shadowRoot.querySelector('#createNameText') !== null) {
        this.shadowRoot.querySelector('#createNameText').removeEventListener('keypress', this.createNameKeypress)
      }

      // window close event

      if (this.closeEvent === true) {
        setTimeout(() => { //tillfällig lösning!! eventet stängs annars före det stängt anslutningen
          this.closeConnection.removeEventListener('oe222ez-window-close', this.windowClosedEvent)
          this.closeEvent = false
        }, 10);
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

    createUserName () {
      const container = this.shadowRoot.querySelector('#messageAppContainer')
      container.appendChild(createUserName.content.cloneNode(true))

      this.UsernameListenerFunction = () => {
        // ta bort båda eventlyssnarna!

        this.disconnectedCallback() // återställer alla eventlyssnare!


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

      this.createNameKeypress = (e) => {
        if (e.key === 'Enter') {
          this.UsernameListenerFunction() // lånar btn klick funktionen (ska göra samma sak!)
        }
      }

      this.shadowRoot.querySelector('#createNameText').addEventListener('keypress', this.createNameKeypress)
    }

    setChannelName () {
      var channel
      if(this.channel === '') {
        channel = 'All channels'
      } else {
        channel = this.channel
      }
      const channelTextNode = document.createTextNode(channel)
      const element = this.shadowRoot.querySelector('#currentChannel')
      element.appendChild(channelTextNode)
    }

    startPrivateChannel () {
      console.log('starts privateChannel')
      this.privateChannel = true
      this.channel = this.shadowRoot.querySelector('#privateChannelText').value
      // upprepas i både denna och allChannels!
      this.shadowRoot.querySelector('#startDiv').remove()

      const chat = this.shadowRoot.querySelector('#messageAppContainer')
      chat.appendChild(chatInterface.content.cloneNode(true))
      

      // display channel
      this.setChannelName()


      console.log('channel: ', this.channel)
      this.beginWebSocketConnection()
    }

    beginWebSocketConnection () {
      this.webSocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')

      this.webSocket.onopen = (e) => {
        this.webSocketConnection = true
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
        
        /*
        // meddelar användaren att anslutningen är avstängd obs denna räknas inte in i 25 meddelanden!
        const textElement = document.createElement('p')
        const messageContainer = this.shadowRoot.querySelector('#messages')
        textElement.innerHTML = 'The Server: You have been disconnected!'
        messageContainer.appendChild(textElement)
        */

        if (this.webSocketConnection === true) { // om anslutningen bryts från servern
          this.webSocketConnection = false

          const message = {
            "data": "You have been disconnected!",
            "username": "The Server"
          }

          this.displayMessage(message)
        }
        
        console.log('---onclose----')
      }

      this.webSocket.onerror = (e) => {
        console.log('---onerror----')
        console.error(e)
        console.log('---onerror----')
      }
        // this.webSocket.close() stänger anslutning


      // lyssnar efter stängd windowkomponent: FLYTTA TILL STARTEVENTLISTENERS!
      this.closeConnection = this.shadowRoot.host.parentNode.parentNode.host //egna window elementet stängs!
      this.closeEvent = true
      console.error(this.closeConnection)

      this.windowClosedEvent = (e) => {
        console.log('message app ser att  window stänger!', e.detail.msg)
        this.webSocket.close()
        this.webSocketConnection = false
      }

      this.closeConnection.addEventListener('oe222ez-window-close', this.windowClosedEvent)




        this.startMessageEventlisteners()
    }

    startMessageEventlisteners () {
      console.log('----- starts eventlisteners! -----')


      this.eventListernerKeypress = (e) => {
        if(e.key === 'Enter') {
          console.log('---sends message!---')
          this.sendMessage()
        }
      }
      const textField = this.shadowRoot.querySelector('#sendMessageText')
      textField.addEventListener('keypress', this.eventListernerKeypress)


      const sendBtn = this.shadowRoot.querySelector('#sendMessageBtn')

      this.eventListernerBtn = () => {
        console.log('---sends message!---')
        this.sendMessage()
      }
      sendBtn.addEventListener('click', this.eventListernerBtn)


      const menuBtn = this.shadowRoot.querySelector('#backButton')

      this.eventListenerMenuBtn = () => {
        console.log('Back to menu!')
        // ta bort eventlyssnare


        // stäng anslutning (FIXA: om den inte redan är stängd!)

        this.webSocket.close()
        this.webSocketConnection = false
        // tar bort create user
        this.shadowRoot.querySelector('#chatInterface').remove()

        this.disconnectedCallback()

        // börja om
         this.connectedCallback()

      }

      menuBtn.addEventListener('click', this.eventListenerMenuBtn)

    }

    onMessage (e) {
     console.log('onMessage')
     const parseData = JSON.parse(e.data)

    console.error(parseData)

    if (this.privateChannel === false) {
      this.displayMessage(parseData)
    } else if (this.privateChannel === true) {
      if (parseData.channel === this.channel || parseData.type === 'notification')
      this.displayMessage(parseData)
    }
    }

    displayMessage (parseData) {
      const textElement = document.createElement('p')

      var username
      if (parseData.username === '') {
       username = 'Undefined'
      } else if (parseData.username === this.username) { // om det är eget meddelande
        username = 'You'
        textElement.setAttribute('style', 'float: right; background-color: #FDED32;') // eget meddelande
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



    sendMessage () {
      console.log('----starts send message ----')

      // hämta data

      const input = this.shadowRoot.querySelector('#sendMessageText')

      if(input.value !== '') {

      const data = {
        "type": "message",
        "data" : input.value,
        "username": this.username,
        "channel": this.channel,
        "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
      }

      console.error(data) // fel: anv undef!

      this.webSocket.send(JSON.stringify(data)) // skickar data!

      this.shadowRoot.querySelector('#sendMessageText').value = ''

      // ta bort text från input
      
    }
    }
    

  }
)
