/**
 *
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#startMenu {
  display:block;
  background-color: green;
  width: 100%;
  height: 270px;
}
h1 {
  text-align: center;
  margin: 0;
}
#getCityWeatherContainer {
  background-color: pink;
  display:flex;
  justify-content: center;
  height: 150px;
}
#inputContainer {
  display: inline-block;
  align-self: center
}

#response {
  background-color: yellow;
  height: 19px;
  width: 226px;
}

/*  Weather Response  */

#weatherResponse {
background-color: green;
height: 270px;
}

</style>
<div id="startMenu">
<h1>Weather</h1>
<div id="getCityWeatherContainer">
  <div id="inputContainer">
    <h2>Enter a location</h2>
    <input id="citySearch" type="text" placeholder="City"/>
    <input id="cityBtn" type="button" value="Search"/>
    <p id="response"></p>
  <div>
</div>
<div id="credits">
  <p>Powered by <a href="https://openweathermap.org/" target="_blank">openweathermap.org</a></p>
</div>
</div>
`

const weatherData = document.createElement('template')
weatherData.innerHTML = `
<div id="weatherResponse">
  TEST
</div>
`

customElements.define('oe222ez-weather',
  class extends HTMLElement {

    constructor () {
      super()


      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      //return []
    }

    connectedCallback () {
      this.startClick = () => {
        this.searchCity()
      }
      this.shadowRoot.querySelector('#cityBtn').addEventListener('click', this.startClick)

      // lägg till enter event lyssnare!



      
    //this.showResponse() //temp

    }

    attributeChangedCallback (name, oldValue, newValue) {


    }

    disconnectedCallback () {

    }

    searchCity () {
      this.createLink()
      this.getWeather()
    }

    createLink () {
      const linkPart1 = 'https://api.openweathermap.org/data/2.5/weather?q='
      const linkPart2 = this.shadowRoot.querySelector('#citySearch').value
      const linkPart3 = '&appid=4f844b589b158cb6c66f6c933b7c767c' // använda attribut för api nyckel?

      this.weatherLink = linkPart1.concat(linkPart2 + linkPart3)
    }

    async getWeather () {
      await window.fetch(this.weatherLink).then((response) => { // 401:an stoppas redan här!
        //console.log(response)
        return response.json()
      }).then((jsonResponse) => {
        //console.log(jsonResponse)
        this.lastWeatherResponse = jsonResponse
        this.readResponseCode()
      }).catch((err) => {
        console.error(err)
      })
    }

    readResponseCode () {
      //alert(typeof this.lastWeatherResponse.cod)

      //alert(this.lastWeatherResponse.cod)

      const responseElement = this.shadowRoot.querySelector('#response')
      var textToUser
      if (this.lastWeatherResponse.cod === 200) {
        this.showResponse() // visar resultat
      } else if (this.lastWeatherResponse.cod === 401) { // denna ska vara number! Something is wrong with the api key
        textToUser = `Error: ${this.lastWeatherResponse.cod}`
        console.error('oe222ez-weather: Something is wrong with the api key')

        // meddelande till användaren
        responseElement.innerHTML = textToUser


      } else if (this.lastWeatherResponse.cod === '404') { // Requested city not found or an error with the API request
        textToUser = `Requested city not found err: ${this.lastWeatherResponse.cod}`
        console.error('oe222ez-weather: ', textToUser, ' or an error with the API request!')
        // användaren gjort fel (kan även vara fel på api request)

        responseElement.innerHTML = textToUser


      } else if (this.lastWeatherResponse.cod === '429') { // inte testad! testa innan inlämning!
        textToUser = 'Ran out of requests! (max 60/h)'
        console.error('oe222ez-weather: ', textToUser)
        

        // meddelande till användaren
        responseElement.innerHTML = textToUser

      } else {
        textToUser = 'Something went wrong!'
        console.error('oe222ez-weather: ', textToUser, ' Got an unknown response code: ', this.lastWeatherResponse.cod)

        // meddelande till användaren

      }
    }
    

    showResponse () {
      this.shadowRoot.querySelector('#startMenu').remove() // removes start input

      this.shadowRoot.appendChild(weatherData.content.cloneNode(true))
    }


    

  }
)
