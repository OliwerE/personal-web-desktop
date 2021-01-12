# &lt;oe222ez-message-app&gt;

A web component that represents a message application.

## Dependencies

### `oe222ez-window`
The message component must be placed inside the oe222ez-window shadowroot because of a custom event when the window closes.

## Example

In javascript:
```javascript
const element = document.createElement('oe222ez-window')
const messageElement = document.createElement('oe222ez-message-app')
element.shadowRoot.querySelector('#window').appendChild(messageElement)
document.querySelector('body').appendChild(element)

```