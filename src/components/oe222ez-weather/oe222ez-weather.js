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
</style>
<div id="startMenu">
<h1>Weather</h1>
<div id="getCityWeatherContainer">
  <div id="inputContainer">
    <h2>Enter a location</h2>
    <input id="citySearch" type="text" placeholder="City"/>
    <input id="cityBtn" type="button" value="Search"/>
  <div>
</div>
<div id="credits">
  <p>Powered by <a href="https://openweathermap.org/" target="_blank">openweathermap.org</a></p>
</div>
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

    }

    attributeChangedCallback (name, oldValue, newValue) {


    }

    disconnectedCallback () {

    }

    searchCity () {
      this.createLink()
      this.getWeather()
      console.log('--- inte slut? ---')
    }

    createLink () {
      const linkPart1 = 'https://api.openweathermap.org/data/2.5/weather?q='
      const linkPart2 = this.shadowRoot.querySelector('#citySearch').value
      const linkPart3 = '&appid=4f844b589b158cb6c66f6c933b7c767c' // använda attribut för api nyckel?

      this.weatherLink = linkPart1.concat(linkPart2 + linkPart3)
    }

    async getWeather () {
      await window.fetch(this.weatherLink).then((response) => {
        console.log(response)
        return response.json()
      }).then((jsonResponse) => {
        console.log(jsonResponse)
      })
    }


    

  }
)
