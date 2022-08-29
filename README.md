# Slider

Woah wow whew slow down chief. You're telling me that in 2022 you are releasing another carousel slider? Honestly why don't you go and invent WordPress 2 while you're ✨ at it ✨.

Anyway, here we go, vanilla js carousel slider. Nothing special.

Start by preparing your HTML.

```html
<div id="slider">
  <div><h2>Hello Slide 1</h2></div>
  <div><h2>Hello Slide 2</h2></div>
  <div><h2>No hello to you slide 3</h2></div>
</div>
```

Initiate the slider

```js
import Slider from "./slider.js"

const slider = new Slider("#slider", {
  width: 600,
  height: 400
})
```

And you're good to go 👍. Out of the box the slider comes with a few methods and some more settings. Check out the **API** section for more details.

## The 'Buzzcut approach'

Hate writing javascript? Tell which linux distro you use while you're at it boss. You can also tag the slider element with an attribute `slider="<your_slider_id>"` or just `slider`. Note: if you don't specify the id, the slider will generate it for you. But you won't know it lol.

With this approach, you don't have to explicitly create a slider instance for each slider. You can also use imported methods, but you have to pass the `your_slider_id` before other arguments.

Let's check out an example:

```html
<div slider="my-slider" slider-width="728" slider-height="480">
  <div><h2>Hello Slide 1</h2></div>
  <div><h2>Hello Slide 2</h2></div>
</div>
```

```js
import { register } from "./slider.js"

// Sliders will be registered when DOM is loaded so it does not matter where you call this function
register()
```

After your DOM is loaded, make sure you import the `register()` method and run it. All it does is collect all the sliders you've prepared and initializes them.

```js
import { next, prev } from "./slider.js"

// Will go to the next slide in the 'my-slider' element
next("my-sldier")
next("my-other-slider")

// If you call this method without id, it will be applied to the first slider it finds in the dom or you'll get a warning that slider was no found
next()
```

---

## API

This api section will contain examples and some will also be split into two parts. Each explaining the normal and buzzcut approach. Rule of thumb, if a callback function contains more than 1 parameter, it will use destructuring, instead of multiple parameters.

### Options

Given the simplicity, the slider class offers a pretty solid amount of customization. The following are all the available options with default values.

```js
/**
 *
 * @param {String} id Query selector for slider elements
 * @param {Object} options Slider options (see documentation)
 * @param {string | Element} mountTo Optional element to mount the slider to
 */
const slider = new Slider(id, options, mountTo)

const slider = new Slider("#my-slider", {
  // Controls if user can interact with the slider
  enabled: true,
  // Slider element width in pixels
  width: null, // 100%
  // Slider element height in pixels
  height: null, // 100%
  // Gap between each slide in pixels
  gap: 16,
  // Currently active slide
  active: 0,
  // Enables / disables control dots
  dots: true,
  // Enables / disables left and right control buttons
  buttons: true,
  // If set to true, slider will working top to bottom
  vertical: false,
  // Update the CSS transition object
  transition: { time: 0.3, mode: "ease" },
  // Controls which parts of the slider come with pre-made styling
  style: {
    buttons: true,
    dots: true,
    // Disabling this could break the slider functionality without proper user implementation
    root: true
  },
  // Add custom classes to slider elements
  // Because the wrapper + slides are initiated in HTML, you can only add custom class to the generated elements
  class: {
    slider: "slider",
    slide: "slide",
    dots: "slider-dots",
    dot: "slider-dot",
    buttons: "slider-button",
    buttonLeft: "slider-button-left",
    buttonRight: "slider-button-right"
  },
  // Replace the navigation elements with your own
  // Accepts a template string or a HTMLElement
  custom: {
    dots: null,
    buttons: null
  },
  // Callback functions called when these events occur
  on: {
    dragStart: null,
    dragEnd: null,
    slideClick: null,
    slideChange: null, // Fires parallel with all the following events vvv
    slideChangeFromDot: null,
    slideChangeFromButton: null,
    slideChangeFromDrag: null
  }
})
```

### Option events

There are 3 ways to register an event listener in the slider.

- We can use the on object when registering a new slider
- We can use the returned slider instance
- We can use the buzzcut shorthand, all buzzcut methods are prefixed with "on"

#### `onDragStart`, `onDragEnd`

Events fired when dragging starts and ends

Parameters:

- `event` fired event
- `fromIndex` Number of the slide the draggging began on
- `fromEl` Slide element which the dragging began on

```js
const slider = new Slider("#sldier", {
  on: {
    dragStart(event, { fromIndex, fromEl }) {}
  }
})

slider.onDragStart(event, { fromIndex, fromEl }) {}

// Buzzcut
onDragStart("my-slider", (event, { fromIndex, fromEl }) => {})
```

#### `onSlideClick`

Fired whenever user clicks (and doesn't drag) on a slide.

Parameters:

- `event` fired event
- `index` index of clicked slide
- `total` amount of available slides

```js
const slider = new Slider("#sldier", {
  on: {
    slideClick(event, { index, el }) {}
  }
})

// Buzzcut
onSlideClick("my-slider", (event, { index, el }) => {})
```

#### `onSlideChangeFromDot`, `onSlideChangeFromButton`, `onSlideChangeFromDrag`

Fired whenever a slide is changed from one of the listed events.

Parameters:

- `event` fired event
- `fromIndex` Number of the slide the draggging began on
- `fromEl` Slide element which the dragging began on
- `toIndex` Number of the slide the dragging stopped on
- `toEl` Slide element which dragging stopped on

```js
const slider = new Slider("#sldier", {
  on: {
    slideChangeFromDot(event, { fromIndex, fromEl, toIndex, toEl }) {}
  }
})

// Buzzcut
onSlideChangeFromDrag(
  "my-slider",
  (event, { fromIndex, fromEl, toIndex, toEl }) => {}
)
```

---

### Slider navigation methods

These methods help you better manipulate the slider and control it from outside so to say.

#### `next(n)`, `prev(n)`

Simple methods to set a new active slide by moving left or right.

Parameters:

- `by` {Number} (default: 1) sets by how many slides to move forward to

```js
// Jumps to the one after next one
slider.next(2)

// Buzzcut, jumps to the next one
next("my_slider")
```

#### `set(n)`

A powerful method to set the currently active slide. Accepts an index or a function as a parameter.

**Option A** Parameters:

- index {Number} sets index of the active slide

```js
// Sets the third slide as active
slider.set(3)

// Buzzcut
set("my_slider", 3)
```

**Option B** Parameters:

- callback {Function} exposes:
  - `index` currently active slide
  - `total` amount of available slides

The callback function must return a new index

```js
// Simple example but this way offers extensive to manipulate the slider
slider.set(({ index }) => {
  return index + 1
})

set("my_slider", ({ index }) => index + 1)
```

---

### Slider manipulation methods

#### `add(template, index)`

Allows you to insert a new slide into the slider without reloading. You can do so in 3 ways. Use a template string, insert a HTMLElement or use a callback function.

**Option A, Use an element or a template string**

Parameters:

- `slide` template string of the added slide
- `index` {Number} (optional) index of insertion

```js
// Adds a new slide at index 3
slider.add('<div class="slide">New Slide!</slide>', 3)

// Add a new slide element
const slide = document.createElement("div")
slide.innerHTML = "New Slide!"

// Buzzcut
add("my_slider", slide, 3)
```

**Option B, Use a method**

Parameters:

- `callback` function which returns template string or element, callback exposes
  - `total` which is total amount of slides
  - `index` which is the index of the active slide
  - `last` index of the last slide
- `index` {Number} (optional) index of insertion

```js
// Normal usage

slider.add((ctx) => {
  const slide = document.createElement("div")
  slide.innerHTML = "NEW SLIDE!!"

  // You can either return just the element itself
  // The slide will be appended after the last slide
  return slide

  // Or return an array which at index 0 has the slide and index 1 has the index of where to place the new slide
  // This means that the new slide will be placed to the right of the currently active slide
  return [slide, ctx.index + 1]
})

add("my_slider", ({ total }) => {
  // Append a new slide in the middle of the slider
  return [`<div>NEW SLIDE!!</div>` Math.round(total / 2)]
})
```

#### `remove(index)`

Removes a slide at the given index. If no index is provided, removes the first available slide.

**Option A, use an index**

Parameters

- `index` index of the slide you want to remove, default is `0`

```js
slider.remove(2)

// Buzzcut
remove("my_slider", 2)
```

**Option B, use a callback**

Parameters:

- `callback` function which returns template string or element, callback exposes
  - `total` which is total amount of slides
  - `index` which is the index of the active slide
  - `last` index of the last slide

```js
slider.remove((ctx) => {
  // Remove second to last slider
  return ctx.last - 2
})

// Buzzcut, removes the currently active slide
remove("my_slider", ({ index }) => index)
```

#### `disable()`, `enable()`, `toggle()`

Controls wether the slider can be interacted with.

- `disable()` makes the slider unresponsive to user interaction
- `enable()` makes the slider interactable again
- `toggle()` toggles between enabled / disabled state

---

### Experimental / Planned API

#### `reverse()`

Swaps the order of all slides. Effectively reversing it.

#### `config()`

Updates slider configuration without completely refreshing it. Meaning it keep any appended slides or other changes made after its initialization.
