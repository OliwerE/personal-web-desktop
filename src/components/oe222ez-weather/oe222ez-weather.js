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
  width: 100%;
  min-height: 270px;
}
h1 {
  text-align: center;
  margin: 0;
}
#getCityWeatherContainer {
  /*display:flex;
  justify-content: center;*/
  height: 150px;
}
#inputContainer {
  display: inline-block;
  /*align-self: center*/
}

#response {
  height: 19px;
  width: 226px;
  color: red;
}

/*  Weather Response  */

#weatherResponse {
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

#credits p {
  display: block;
  font-size: 14px;
}

</style>
<div id="startMenu">
<h1>Weather</h1>
<div id="getCityWeatherContainer">
  <div id="inputContainer">
    <h2>Enter a location</h2>
    <input class="listenEnter" id="citySearch" type="text" placeholder="city, county or country"/>
    <input class="listenEnter" id="cityBtn" type="button" value="Search"/>
    <p id="response"></p>
  <div>
</div>
<div id="credits">
  <p> "<a href="https://openweathermap.org/api" target="_blank">Weather API</a>" by <a href="https://openweathermap.org/" target="_blank">OpenWeather (TM)</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a></p>
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



  <!--
  <h2 id="responseCity"></h2>
  <img id="weatherIcon" alt="A weather icon"/>-->
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
        // ta bort eventlistener
        this.searchCity()
      }
      this.shadowRoot.querySelector('#cityBtn').addEventListener('click', this.startClick)


      this.startEnter = (e) => {
        if (e.key === 'Enter') {
          // ta bort eventlistener
          this.searchCity()
        }
      }
      this.shadowRoot.querySelector('#citySearch').addEventListener('keypress', this.startEnter)

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
        textToUser = `Request error: ${this.lastWeatherResponse.cod}`
        console.error('oe222ez-weather: Something is wrong with the api key')

        // meddelande till användaren
        responseElement.innerHTML = textToUser


      } else if (this.lastWeatherResponse.cod === '404') { // Requested city not found or an error with the API request
        textToUser = `Location not found err: ${this.lastWeatherResponse.cod}`
        console.error('oe222ez-weather: ', textToUser, ' or an error with the API request!')
        // användaren gjort fel (kan även vara fel på api request)

        responseElement.innerHTML = textToUser


      } else if (this.lastWeatherResponse.cod === '429') { // inte testad! testa innan inlämning!
        textToUser = `Try again later! Err: ${this.lastWeatherResponse.cod}`
        console.error('oe222ez-weather: Ran out of requests! max 60/h', this.lastWeatherResponse.cod)
        

        // meddelande till användaren
        responseElement.innerHTML = textToUser

      } else {
        textToUser = `Something went wrong! ${this.lastWeatherResponse.cod}`
        console.error('oe222ez-weather: ', textToUser, ' Got an unknown response code: ', this.lastWeatherResponse.cod)

        // meddelande till användaren

      }
    }
    

    showResponse () {
      this.shadowRoot.querySelector('#startMenu').remove() // removes start input
      this.shadowRoot.appendChild(weatherData.content.cloneNode(true))
      
      this.shadowRoot.querySelector('#responseCity').innerHTML = this.lastWeatherResponse.name // platsens namn

      const responseContainer = this.shadowRoot.querySelector('#weatherResponse')



      // desc:
      const description = this.shadowRoot.querySelector('#responseDesc')
      this.createTextElement(this.lastWeatherResponse.weather[0].description, description)


      //img:
      const iconSrc = `https://openweathermap.org/img/wn/${this.lastWeatherResponse.weather[0].icon}.png`
      this.shadowRoot.querySelector('#weatherIcon').setAttribute('src', iconSrc)

      // wanted main data
      const wantedMainParameters = ['temp', 'feels_like', 'temp_min', 'temp_max', 'humidity']
      for (let i = 0; i < wantedMainParameters.length; i++) {
        var elementId = this.shadowRoot.querySelector(`#${wantedMainParameters[i]}`)
        var parameter = wantedMainParameters[i]
        var parameterResponse = this.lastWeatherResponse.main[parameter] // debug
        
        var text
        if (i < wantedMainParameters.length - 1) { // om det är någon av temperaturerna
          parameterResponse = (parameterResponse - 273.15).toFixed(0) + ' C'
          text = parameter.replace('_', ' ') + ': ' + parameterResponse
        } else { // Om det är humidity
          text = `Humidity: ${parameterResponse} %`
        }


        var data = document.createTextNode(`${text}`)
        elementId.appendChild(data)

        //this.createTextElement(text, responseContainer)
      }


      // windspeed:
      const windSpeedElement = this.shadowRoot.querySelector('#windSpeed')
      const windspeed = `Windspeed: ${this.lastWeatherResponse.wind.speed} m/s`
      const windSpeedTextNode = document.createTextNode(windspeed)
      windSpeedElement.appendChild(windSpeedTextNode)


      //this.createTextElement(windspeed, responseContainer)
      

    }
    
    createTextElement (text, container) { // används bara av desc kanske ändra??
      const element = document.createElement('p')
      const textNode = document.createTextNode(text)
      element.appendChild(textNode)
      container.appendChild(element)
    }


    

  }
)
