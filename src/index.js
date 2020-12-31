/**
 * The main script file of the application.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.0.0
 */

import './components/oe222ez-window/index'
import './components/oe222ez-tile/index'
import './components/oe222ez-memory/index'

console.log('TODO: Start working on the assignment')


// fönster komponent med memory (test)
const memoryWindow = () => {
//fönster
const element = document.createElement('oe222ez-window')
const select = document.querySelector('body')
select.appendChild(element)

//memory


const element2 = document.createElement('oe222ez-memory')
const select2 = document.querySelector('body').lastChild.shadowRoot.querySelector('#window')
select2.appendChild(element2)

}
document.querySelector('#memoryWindow').addEventListener('click', memoryWindow)


