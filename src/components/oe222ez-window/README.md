# &lt;oe222ez-window&gt;

A web component that represents a moveable window. The window can move on the inside of the element it is added to.


## Events

| Event Name               | Fired When                        |
| ------------------------ | --------------------------------- |
| `oe222ez-window-close`   | Dispatched when the window is closed                 |


## Example

In HTML:
```html
<oe222ez-window id="exampleId"></oe222ez-window>
```
Then in javascript:
```javascript
const windowSlot = document.queryselector('#exampleId').shadowroot.queryselector('#windowSlot')

const slotElement = document.createElement('ExampleElement')

windowSlot.appendChild(slotElement)
```