/**
 * Represents a webcomponent displaying the current weather.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#startMenu {
  display:block;
  width: 100%;
  max-width: 450px;
  min-height: 270px;
}
h1 {
  text-align: center;
  margin: 0;
}
#getCityWeatherContainer {
  display:flex;
  justify-content: center;
  height: 150px;
}
#inputContainer {
  display: inline-block;
  align-self: center
}

#response {
  height: 19px;
  width: 226px;
  color: red;
}

/*  Weather Response  */

#weatherResponse {
  max-width: 450px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 50px 100px 25px 100px 50px;
  grid-template-areas:
  "title title title"
  ". icon current"
  "desc desc desc"
  "temps . otherData"
  ". btn .";

}

#weatherResponseTitle {
  grid-area: title;
  text-align: center;
  margin: 0;
}

#weatherIcon {
  grid-area: icon;
  width: 100%;
  height: 100px;
}

#temp {
  grid-area: current;
  margin: 0;
  margin-top: 30px;
  font-size: 25px;
}

p {
  margin: 0;
}

h3 {
  margin: 0;
  text-align: center;
}

#gridDesc {
  grid-area: desc;
  text-align: center;
}

#gridTemps {
  grid-area: temps;
}

#gridotherData {
  grid-area: otherData;
}

#returnBtnContainer {
  grid-area: btn;
}

#returnBtn {
  width: 100%;
  height: 100%;
}

#credits {
  display: block;
  font-size: 14px;
}

</style>
`

const startTemplate = document.createElement('template')
startTemplate.innerHTML = `
<div id="startMenu">
<h1>Weather</h1>
<div id="getCityWeatherContainer">
  <div id="inputContainer">
    <h2>Enter a location</h2>
    <input class="listenEnter" id="citySearch" type="text" placeholder="city, county or country"/>
    <input class="listenEnter" id="cityBtn" type="button" value="Search"/>
    <p id="response"></p>
    <p id="credits">"<a href="https://openweathermap.org/api" target="_blank">Weather API</a>" by <a href="https://openweathermap.org/" target="_blank">OpenWeather (TM)</a><br> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a></p>
</div>
</div>
`

const weatherData = document.createElement('template')
weatherData.innerHTML = `
<div id="weatherResponse">
  <div id="weatherResponseTitle">
    <h2 id="responseCity"></h2>
  </div>
  <img id="weatherIcon" alt="A weather icon"/>
  <h3 id="temp"></h3>
  <div id="gridDesc">
    <p id="responseDesc"></p>
  </div>
  <div id="gridTemps">
  <h3>Temperatures</h3>
  <p id="feels_like"></p>
  <p id="temp_min"></p>
  <p id="temp_max"></p>

   </div>
  <div id="gridotherData">
  <h3>Other data</h3>
  <p id="humidity"></p>
  <p id="windSpeed"></p>
  </div>
  <div id="returnBtnContainer">
  <input id="returnBtn" type="button" value="Back"/>
  </div>
</div>
`

customElements.define('oe222ez-weather',
  /**
   * Class represents the custom oe222ez-weather element.
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
     * Adds the start menu in the shadowroot and adds eventlisteners for input and search button.
     */
    connectedCallback () {
      this.shadowRoot.appendChild(startTemplate.content.cloneNode(true)) // Adds start menu to the dom

      /**
       * An event listener function used to search a location.
       */
      this.startClick = () => {
        this.searchLocation()
      }
      this.shadowRoot.querySelector('#cityBtn').addEventListener('click', this.startClick)

      /**
       * An event listener function used to search a location when enter is pressed.
       *
       * @param {object} e - An event object.
       */
      this.startEnter = (e) => {
        if (e.key === 'Enter') {
          this.searchLocation()
        }
      }
      this.shadowRoot.querySelector('#citySearch').addEventListener('keypress', this.startEnter)
    }

    /**
     * Removes event listeners.
     */
    disconnectedCallback () {
      if (this.shadowRoot.querySelector('#cityBtn') !== null) {
        this.shadowRoot.querySelector('#cityBtn').removeEventListener('click', this.startClick)
      }
      if (this.shadowRoot.querySelector('#citySearch') !== null) {
        this.shadowRoot.querySelector('#citySearch').removeEventListener('keypress', this.startEnter)
      }
      if (this.shadowRoot.querySelector('#returnBtn') !== null) {
        this.shadowRoot.querySelector('#returnBtn').removeEventListener('click', this.returnButtonEvent)
      }
    }

    /**
     * A method searching a location.
     */
    searchLocation () {
      if (this.shadowRoot.querySelector('#citySearch').value !== '') {
        this.createLink() // Creates request link
        this.getWeather() // Sends http request
      } else {
        this.shadowRoot.querySelector('#response').innerHTML = 'Enter a location!'
      }
    }

    /**
     * Creates a link for the http request.
     */
    createLink () {
      const linkPart1 = 'https://api.openweathermap.org/data/2.5/weather?q='
      const linkPart2 = this.shadowRoot.querySelector('#citySearch').value
      const linkPart3 = '&appid=4f844b589b158cb6c66f6c933b7c767c'

      this.weatherLink = linkPart1.concat(linkPart2 + linkPart3)
    }

    /**
     * Sends a http request to get the current weather.
     */
    async getWeather () {
      await window.fetch(this.weatherLink).then((response) => {
        return response.json()
      }).then((jsonResponse) => {
        this.lastWeatherResponse = jsonResponse
        this.readResponseCode()
      }).catch((err) => {
        console.error(err)
      })
    }

    /**
     * A method reading the response from the api.
     */
    readResponseCode () {
      const responseElement = this.shadowRoot.querySelector('#response')
      let textToUser
      if (this.lastWeatherResponse.cod === 200) { // Got a weather response
        this.showResponse() // Displays result
      } else if (this.lastWeatherResponse.cod === 401) { // Error with api key
        textToUser = 'Request error'
        console.error('oe222ez-weather: Something is wrong with the api key')
        responseElement.innerHTML = textToUser // Message to the user
      } else if (this.lastWeatherResponse.cod === '404') { // Requested city not found or an error with the API request
        textToUser = 'Location not found'
        console.error('oe222ez-weather: ', textToUser, ' or an error with the API request!')
        responseElement.innerHTML = textToUser
      } else if (this.lastWeatherResponse.cod === '429') { // Ran out of api key requests
        textToUser = 'Try again later!'
        console.error('oe222ez-weather: Ran out of requests! max 60/h', this.lastWeatherResponse.cod)
        responseElement.innerHTML = textToUser
      } else {
        textToUser = 'Something went wrong!'
        console.error('oe222ez-weather: ', textToUser, ' Got an unknown response code: ', this.lastWeatherResponse.cod)
        responseElement.innerHTML = textToUser
      }
    }

    /**
     * Displays the response from the api.
     */
    showResponse () {
      this.changeToResponseTemplate()
      this.responseTemplateAddText()
    }

    /**
     * Changes to the weather data template.
     */
    changeToResponseTemplate () {
      this.disconnectedCallback() // Removes event listerners
      this.shadowRoot.querySelector('#startMenu').remove() // removes start input
      this.shadowRoot.appendChild(weatherData.content.cloneNode(true))

      /**
       * An event listener function used to return to the menu.
       */
      this.returnButtonEvent = () => {
        this.shadowRoot.querySelector('#returnBtn').removeEventListener('click', this.returnButtonEvent)
        this.restart()
      }

      this.shadowRoot.querySelector('#returnBtn').addEventListener('click', this.returnButtonEvent)
    }

    /**
     * Method adds text in the weather data template.
     */
    responseTemplateAddText () {
      // Location
      const cityName = document.createTextNode(this.lastWeatherResponse.name)
      this.shadowRoot.querySelector('#responseCity').appendChild(cityName)

      // Weather description
      const weatherDesc = document.createTextNode(this.lastWeatherResponse.weather[0].description)
      this.shadowRoot.querySelector('#responseDesc').appendChild(weatherDesc)

      // Weather icon
      const iconSrc = `https://openweathermap.org/img/wn/${this.lastWeatherResponse.weather[0].icon}.png`
      this.shadowRoot.querySelector('#weatherIcon').setAttribute('src', iconSrc)

      // Adds weather data in the dom
      const wantedMainParameters = ['temp', 'feels_like', 'temp_min', 'temp_max', 'humidity', 'windSpeed']
      for (let i = 0; i < wantedMainParameters.length; i++) {
        const elementId = this.shadowRoot.querySelector(`#${wantedMainParameters[i]}`)
        const parameter = wantedMainParameters[i]
        let parameterResponse = this.lastWeatherResponse.main[parameter]

        let text
        if (i < wantedMainParameters.length - 2) { // If the current index is a temperature
          parameterResponse = (parameterResponse - 273.15).toFixed(0) + ' C'
          text = parameter.replace('_', ' ') + ': ' + parameterResponse
        } else if (i === 4) { // If the current index is humidity
          text = `Humidity: ${parameterResponse} %`
        } else if (i === 5) { // If the current index is wind speed
          text = `Windspeed: ${this.lastWeatherResponse.wind.speed.toFixed(0)} m/s`
        }

        const data = document.createTextNode(`${text}`)
        elementId.appendChild(data)
      }
    }

    /**
     * Method returns to the menu from the weather response.
     */
    restart () {
      this.shadowRoot.querySelector('#weatherResponse').remove()
      this.connectedCallback() // Starts menu
    }
  }
)
