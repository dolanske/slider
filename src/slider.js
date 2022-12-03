"use strict"

/*----------  CSS  ----------*/

const iconLeft =
  '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z"/></svg>'
const iconright =
  '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"/></svg>'

const CSS_root_required = /* CSS */ `
  .slider {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  
  #slider-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
  }
  
  .slider-disable-transition {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
  }
`

const CSS_root_style = /* CSS */ `
  .slider {
    border-radius: 8px;
  }

  .slide {
    border-radius: 8px;
    background-color: #eaeaea;
  }
`

const CSS_dots_style = /* CSS */ `
  .slider-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: absolute;
    left: 0;
    gap: 12px;
    bottom: 16px;
  }

  .slider-dots .slider-dot {
    transition: 0.1s all ease-in-out;
    display: block;
    width: 11px;
    height: 11px;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    background-color: rgb(210, 210, 210);
  }

  .slider-dots .slider-dot:hover {
    background-color: rgb(185, 185, 185);
  }

  .slider-dots .slider-dot.active {
    background-color: SlateBlue;
  }
`

const CSS_btn_style = /* CSS */ `
  #slider-button-left,
  #slider-button-right {
    border-radius: 50%;
    display: block;
    background-color: fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.1s all ease-in-out;
    border: none;
    right: unset;
    width: 48px;
    height: 48px;
    left: 8px;
    background-color: rgb(210, 210, 210);
    z-index: 10;
    cursor: pointer;
  }
  
  #slider-button-left:hover,
  #slider-button-right:hover {
    background-color: rgb(185, 185, 185);
  }
  
  #slider-button-left:disabled,
  #slider-button-right:disabled {
    background-color: rgb(235, 235, 235);
    pointer-events: none;
  }

  #slider-button-left:disabled svg,
  #slider-button-right:disabled svg {
    fill: darkgray;
    pointer-events: none;
  }
  
  #slider-button-left svg,
  #slider-button-right svg {
    width: 18px;
    height: 18px;
    pointer-events: none;
    fill: black;
  }
  
  #slider-button-right {
    left: unset;
    right: 8px;
  }
`

/*----------  Helper Functions  ----------*/

/**
 * Applies inline style attribute to selected element
 *
 * @param {element | array<element>} elements
 * @param {string} property
 * @param {any} value
 * @param {string | undefined} unit
 */

function setStyle(el, property, value, unit) {
  const apply = (item, prop, val, unit = "") => (item.style[prop] = val + unit)

  if (Array.isArray(el)) {
    el.map((item) => apply(item.el, item.prop, item.value, item.unit))
    return
  }

  apply(el, property, value, unit)
}

const minDiff = (a, b, v) => Math.abs(a - b) > v && Math.abs(b - a) > v
const isNil = (v) => v === undefined || v === null
export const isEmpty = (v) => v.length === 0 || isNil(v)
const isFunc = (v) => Object.prototype.toString.call(v) == "[object Function]"
const isEl = (v) =>
  typeof HTMLElement === "object"
    ? v instanceof HTMLElement
    : v &&
      typeof v === "object" &&
      v !== null &&
      v.nodeType === 1 &&
      typeof v.nodeName === "string"
const makeEl = (t) => {
  const w = document.createElement("div")
  w.innerHTML = t
  return w.firstChild
}
const isObject = (o) => o && typeof o === "object"
const mergeDeep = (...items) => {
  return items.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]
      const oVal = obj[key]

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })

    return prev
  }, {})
}
const debounce = (fn, timeout = 300) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => {
      fn.apply(this, args)
    }, timeout)
  }
}

function prefersReduced() {
  return window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

}

/*----------  Main Slider Class  ----------*/

// Minimum amount of pixels to drag before a slide changes
const MIN_DRAG = 75
export const DEFAULTS = {
  enabled: true,
  width: null,
  height: null,
  gap: 16,
  active: 0,
  dots: true,
  buttons: true,
  transition: { time: 0.3, mode: "ease" },
  vertical: false,
  arrows: false,
  style: {
    root: true,
    buttons: true,
    dots: true,
    headless: false,
  },
  class: {
    slider: "slider",
    slide: "slide",
    dots: "slider-dots",
    dot: "slider-dot",
    buttons: "slider-button",
    buttonLeft: "slider-button-left",
    buttonRight: "slider-button-right"
  },
  custom: {
    dots: null,
    buttons: null
  }
}

class Slider {
  /**
   *
   * @param {String | Element} id Query selector for slider elements
   * @param {Object} options Slider options (see documentation)
   * @param {string | Element} mountTo Optional element to mount the slider to
   */
  constructor(id, options = {}, mountTo) {
    this.on = {
      dragStart: () => {},
      dragEnd: () => {},
      slideClick: () => {},
      slideChange: () => {},
      slideChangeFromButton: () => {},
      slideChangeFromDot: () => {},
      slideChangeFromDrag: () => {}
    }
    this.config = mergeDeep(DEFAULTS, options)
    this.on = Object.assign(this.on, options?.on ?? {})
    this.ready = false
    this.id = id
    this.wrap = null
    this.slides = null
    this.dots = null
    this.active = this.config.active
    this.style = null
    this.dragging = false
    this.dragStart = 0
    this.fromLeft = 0
    this.changedBy = ""
    this.left = document.createElement("button")
    this.right = document.createElement("button")
    this.mountTo =
      typeof mountTo === "string" ? document.querySelector(mountTo) : null

    this._init()
  }

  /*----------  Private API  ----------*/

  _init() {
    this.root =
      typeof this.id === "string" ? document.querySelector(this.id) : this.id

    if (!this.root) {
      throw new Error(
        `Did not find element with the id ${this.id}. Make sure your body contains <div id="${this.id}"></div> \n\n`
      )
    }

    // If mount to element is provided, "teleport" the slider there
    if (this.mountTo) {
      this.mountTo.appendChild(this.root)
    }

    // Append style element to the document's head
    if (!this.config.disableStyle) {
      const styleEl = document.querySelector("#slider-style-element")

      if (!styleEl) {
        const style = document.createElement("style")
        style.id = "slider-style-element"

        style.appendChild(document.createTextNode(CSS_root_required))
        // style.appendChild(document.createTextNode(CSS_dots_required))
        // style.appendChild(document.createTextNode(CSS_btn_required))

        if (!this.config.style.headless) {
          if (this.config.style.root === true)
            style.appendChild(document.createTextNode(CSS_root_style))
          if (this.config.style.dots  === true)
            style.appendChild(document.createTextNode(CSS_dots_style))
          if (this.config.style.buttons  === true)
            style.appendChild(document.createTextNode(CSS_btn_style))
        }


        document.head.appendChild(style)
      }
    }

    // Custom buttons
    const custom = this.config.custom.buttons

    if (custom) {
      this.left = typeof custom === "string" ? makeEl(custom) : custom
      this.right = typeof custom === "string" ? makeEl(custom) : custom
    } else {
      this.left.innerHTML = iconLeft
      this.right.innerHTML = iconright
    }

    // Add aria labels to navigation buttons
    // SECTION: accessibility
    this.left.setAttribute('aria-label', 'Previous slide')
    this.left.setAttribute('title', 'Previous slide')

    this.right.setAttribute('aria-label', 'Next slide')
    this.right.setAttribute('title', 'Next slide')

    this.root.setAttribute('role', 'region')
    this.root.setAttribute('aria-label', `Slider ${this.id}`)

    // Wrap inner children in a new element which will handle touch screens
    const org_html = this.root.innerHTML
    const new_html = "<div id='slider-wrapper'>" + org_html + "</div>"
    this.root.innerHTML = new_html
    this.root.classList.add(this.config.class.slider)
    this.wrap = this.root.children[0]
    this.slides = this.wrap.children

    if (this.config.width) {
      this.rootWidth = this.config.width
    } else {
      this.rootWidth = Number(
        window
          .getComputedStyle(this.root)
          .getPropertyValue("width")
          .slice(0, -2)
      )
    }

    if (this.config.height) {
      this.rootHeight = this.config.height
    } else {
      this.rootHeight = Number(
        window
          .getComputedStyle(this.root)
          .getPropertyValue("height")
          .slice(0, -2)
      )
    }

    // Prepare slide sizing
    // NOTE: should get a slide property which is not tied to a slide itself
    // The reason for that is, if we show 2 divs per slide, then suddenly we'll
    // have to divide the number of active slides / dots etc. by the amount
    // of "slides" per slide

    // REVIEW
    // Could sub-dividing slides into wrapper "slides" simplify the implementatiion?
    // No extra coding apart from creating those sub-slides would be required

    // Essentially wrap-slide would have similar flex settings with the same gap as the config
    if (this.config.slides > 1) {
      // TODO: if more than 1 slide is showing, must calculate slide width based on that
    } else {
      this.slideWidth = this.rootWidth
    }

    // Create style element and append it to the head to store dynamic styles
    this.style = document.createElement("style")
    document.head.appendChild(this.style)

    // Button configuration
    if (this.config.buttons) {
      // Append class names
      this.left.classList.add(this.config.class.buttons)
      this.right.classList.add(this.config.class.buttons)

      this.left.classList.add(this.config.class.buttonLeft)
      this.right.classList.add(this.config.class.buttonRight)

      // Add a unique ID for styling purposes
      this.left.setAttribute("id", "slider-button-left")
      this.right.setAttribute("id", "slider-button-right")

      this.left.addEventListener("click", () => {
        this.changedBy = "button"
        this.prev(1)
      })
      this.right.addEventListener("click", () => {
        this.changedBy = "button"
        this.next(1)
      })

      this.root.appendChild(this.left)
      this.root.appendChild(this.right)
    }

    // Handle events
    this.wrap.addEventListener("mousedown", (e) => this._handleDragStart(e))
    this.wrap.addEventListener("mousemove", (e) => this._handleDragMove(e))
    this.wrap.addEventListener("mouseup", (e) => this._handleDragEnd(e))
    this.wrap.addEventListener("mouseleave", (e) => this._handleMouseLeave(e))

    if (this.config.arrows) {
      window.addEventListener("keydown", (e) => this._handleKeyPress(e))
    }

    for (const slide of this.slides) {
      slide.classList.add(this.config.class.slide)
      slide.addEventListener("click", (e) => this._handleSlideClick(e))
    }

    // Add an event listener to recalculate root width
    // unless we use a specific dimensions
    window.addEventListener(
      "resize",
      debounce(() => {
        // Update root values
        if (!this.config.width) {
          this.rootWidth = Number(
            window
              .getComputedStyle(this.root)
              .getPropertyValue("width")
              .slice(0, -2)
          )
        }

        if (!this.config.height) {
          this.rootHeight = Number(
            window
              .getComputedStyle(this.root)
              .getPropertyValue("height")
              .slice(0, -2)
          )
        }

        // Trigger style recalculation
        this._updateCSS()
      }, 10)
    )

    this._updateCSS()
    this._generateDots()
    this._updateNav(this.active)

    // When this is true, slider is usable
    this.ready = true
  }

  _handleKeyPress({ key }) {
    if (this.config.enabled) {
      if (key == "ArrowLeft") this.prev()
      if (key == "ArrowRight") this.next()
    }
  }

  _currentDragPos(e) {
    return Math.abs(this.root.getBoundingClientRect().left - e.clientX)
  }

  _handleDragStart(e) {
    this.wrap.classList.add("slider-disable-transition")
    this.dragging = true
    this.dragStart = this._currentDragPos(e)
    this.on.dragStart(e, {
      fromIndex: this.active,
      fromEl: this.slides[this.active]
    })
  }

  _handleDragEnd(e) {
    this.wrap.classList.remove("slider-disable-transition")
    this.dragging = false

    const from = this.active

    const dragEnd = this._currentDragPos(e)

    if (minDiff(this.dragStart, dragEnd, MIN_DRAG)) {
      this.changedBy = "drag"

      if (this.dragStart < dragEnd) {
        this.prev()
      } else {
        this.next()
      }

      this.on.dragEnd(e, {
        fromIndex: from,
        fromEl: this.slides[from],
        toIndex: this.active,
        toEl: this.slides[this.active]
      })
    } else {
      this._set(this.active)
    }
  }

  _handleDragMove(e) {
    if (this.dragging) {
      const pos = this._currentDragPos(e)
      const move = this.dragStart - pos
      setStyle(this.wrap, "left", this.fromLeft + move * -1, "px")
    }
  }

  _handleSlideClick(e) {
    this.on.slideClick(e, {
      index: this.active,
      el: this.slides[this.active]
    })
  }

  _handleMouseLeave(e) {
    if (this.dragging) {
      this.dragging = false
      this._handleDragEnd(e)
    }
  }

  // During recalculation, clear all dynamic styling
  _updateCSS() {
    this.style.replaceChildren()

    if (this.config.height) {
      setStyle(this.root, "height", this.rootHeight, "px")
    }

    if (this.config.width) {
      setStyle(this.root, "width", this.rootWidth, "px")
    }

    // SECTION: accessibility
    if (prefersReduced()) {
      this.config.transition.time = 0
    }

    setStyle(
      this.wrap,
      "transition",
      `${this.config.transition.time}s left ${this.config.transition.mode}`
    )
    setStyle(this.wrap, "gap", this.config.gap, "px")
    setStyle(
      this.wrap,
      "flex-direction",
      this.config.reverse ? "row-reverse" : "row"
    )

    setStyle(
      this.wrap,
      "width",
      this.rootWidth * this.slides.length +
        (this.slides.length - 1) * this.config.gap,
      "px"
    )

    for (const slide of this.slides) {
      setStyle(slide, "width", this.rootWidth, "px")
      setStyle(slide, "height", this.rootHeight, "px")
    }
  }

  _generateDots() {
    if (this.config.dots) {
      // Reset dots
      if (this.dots) {
        this.dots.replaceChildren()
      }

      // Create dot wrapper
      this.dots = document.createElement("div")
      this.dots.setAttribute('role', 'group')
      this.dots.classList.add(this.config.class.dots)

      // Loop over each slide and create a button for it
      for (let i = 0; i < this.slides.length; i++) {
        let dot = document.createElement("button")

        // If user wants to use custom element for dots
        const custom = this.config.custom.dots

        if (custom) {
          // Replace native dot with the userp provided element
          dot = typeof custom === "string" ? makeEl(custom) : custom
        } else {
          dot.classList.add(this.config.class.dot)
        }

        // SECTION: accessibility
        dot.setAttribute('aria-label', `Slide ${i + 1} of ${this.slides.length}`)

        dot.addEventListener("click", () => {
          this.changedBy = "dot"
          this._set(i)
        })

        this.dots.appendChild(dot)
      }

      // Append dots to the wrap element
      this.root.appendChild(this.dots)
    }
  }

  _updateNav(index) {
    if (index === 0) {
      this.left.setAttribute("disabled", true)
      this.left.setAttribute("aria-disabled", true)
    } else {
      this.left.removeAttribute("disabled")
      this.left.setAttribute("aria-disabled", false)
    }

    if (index === this.slides.length - 1) {
      this.right.setAttribute("disabled", true)
    } else {
      this.right.removeAttribute("disabled")
    }

    if (this.config.dots) {
      // this.dots.children[index]
      for (let i = 0; i < this.slides.length; i++) {
        if (i === index) {
          this.dots.children[i].classList.add("active")
          this.dots.children[i].setAttribute('aria-current', true)
        } else {
          this.dots.children[i].classList.remove("active")
          this.dots.children[i].setAttribute('aria-current', false)
        }
      }
    }
  }

  // Sets current slide index
  _set(index) {
    if (!this.ready || this.config.disabled) return

    const old = this.active

    if (index < 0) index = 0
    if (index >= this.slides.length) index = this.slides.length - 1

    this.active = index
    let left = 0

    if (index !== 0) {
      left = (this.slideWidth + this.config.gap) * index * -1
    }

    this.fromLeft = left

    setStyle(this.wrap, "left", left, "px")

    this._updateNav(index)

    const changeEventObject = {
      fromIndex: old,
      fromEl: this.slides[old],
      toIndex: index,
      toEl: this.slides[index]
    }

    switch (this.changedBy) {
      case "button": {
        this.on.slideChangeFromButton(changeEventObject)
        break
      }
      case "dot": {
        this.on.slideChangeFromDot(changeEventObject)
        break
      }
      case "drag": {
        this.on.slideChangeFromDrag(changeEventObject)
        break
      }
    }

    this.on.slideChange({
      ...changeEventObject,
      ...(this.changedBy && { by: this.changedBy })
    })
    this.changedBy = null
  }

  /*----------  Public API  ----------*/

  /**
   * Goes to the next slide unless it's the last slide
   *
   * @public
   * @param {number} by specifies how many slides to jump, default is 1
   */
  next(by = 1) {
    this._set(this.active + by)
  }

  /**
   * Goes to the previous slide unless it's the first slide
   *
   * @public
   * @param {number} by specifies how many slides to jump, default is 1
   */
  prev(by = 1) {
    this._set(this.active - by)
  }

  /**
   * Allows user to set a slide index, if it's within the slide range
   *
   * @public
   * @param {number | function} func Accepts either index or a function which should return the index
   *
   * Function exposes
   * @param index current slide index
   * @param total total amount of slides available
   */
  set(func) {
    if (isNil(func)) {
      throw new TypeError("Invalid input")
    }

    if (!isNaN(func)) {
      // Set the index only
      this._set(func)
    }

    if (typeof func === "function") {
      const index = func({
        index: this.active,
        total: this.slides.length
      })

      if (isNaN(index) || isNil(index)) {
        throw new TypeError("You must return a number in the set() function")
      }

      this._set(index)
    }
  }

  /**
   * Appends a slide to the slider.
   *
   * @param {function | string | HTMLElement} slide
   * @param {number} index at which index to insert the new slide
   *
   * Following examples will demonstarted the ways the function can be used in
   *
   * @example
   *  // Add a new slide to the start of the slider
   *  add('<div class="slide">Helo World<div>', 0)
   *
   * @example
   *  // Adds an empty slide at the end of the slider
   *  const el = createElement('div')
   *  el.classList.add('slide')
   *  add(el)
   *
   * @example
   *  // Add a slide in the middle of the slider
   *  add(({total}) => {
   *    const index = Math.abs(total / 2)
   *
   *    // This method can again either return an element or a template string
   *    // if you want to specify the index, return an array with the element & index
   *    return [`<div class="slide"></div>`, index] // index specified
   *    return `<div class="slide"></div>` // no index
   *
   *    // or
   *    const el = createElement('div')
   *    el.classList.add('slide')
   *
   *    return [el, index]
   *  })
   */
  add(slide, index = null) {
    // If index is not specified, set it as the last one

    if (isNil(index)) index = this.slides.length

    if (typeof slide === "string") {
      this.add(makeEl(slide), index)
    } else if (isFunc(slide)) {
      // We insert a function which should return a string or a html node

      const el = slide({
        index: this.active,
        total: this.slides.length,
        last: this.slides.length - 1
      })

      if (Array.isArray(el)) {
        const [element, i] = el
        this.add(element, i)
      } else {
        // Call itself because this returns either string or a HTML element
        this.add(el, index)
      }
    } else if (isEl(slide)) {
      // is a html element
      this.wrap.insertBefore(slide, this.wrap.children[index])
    }

    this._updateCSS()
    this._generateDots()
    this._updateNav(this.active)
    this.slides = this.wrap.children
  }

  /**
   * Removes a slide at the given index from the slider
   *
   * @param {number} index
   */

  remove(index) {
    if (isNil(index)) index = 0

    // If index is a function, apply it, and call itself
    if (isFunc(index)) {
      const i = index({
        index: this.active,
        total: this.slides.length,
        last: this.slides.length - 1
      })

      this.remove(i)
      return
    }

    if (isNaN(index)) throw new TypeError("Invalid index type")

    // Remove slide from the slides array
    this.wrap.removeChild(this.slides[index])

    // If the current active is not 0 and is the last slide
    // we need to change the active slide in case the index
    // is outside of  available slides
    if (index >= this.active && index > 0) {
      // We only have to calculate it if the removed slide was the last one
      // since slides at 0 will just shift and the active will be the "first" one
      this._set(this.active - 1)
    }

    this._updateCSS()
    this._generateDots()
    this._updateNav(this.active)
  }

  /**
   * Disable slider, freezing it until enabled
   */

  disable() {
    this.config.enabled = false
    this.root.style.pointerEvents = "none"
  }

  /**
   * Enable slider
   */

  enable() {
    this.config.enabled = true
    this.root.style.pointerEvents = "all"
  }

  /**
   * Toggle between enabled and disabled state
   */

  toggle() {
    if (this.config.enabled) {
      this.disable()
    } else {
      this.enable()
    }
  }

  setConfig(conf) {
    console.warn(
      "[Experimental] This function is not implemented yet. Hello world?"
    )

    console.log(conf);

    // Update internal settings

    // Re-render controls

    // KEEP SLIDERS!!
  }

  /**
   * Reverses the order of all sliders
   */

  reverse() {
    this.wrap.style.flexDirection =
      this.wrap.style.flexDirection === "row-reverse" ? "row" : "row-reverse"
  }

  /*----------  Events  ----------*/

  /**
   * Fires when user begins dragging a slide.
   *
   * Callback params (destructured)
   *
   * - `fromIndex` Number of the slide the draggging began on
   * - `fromEl` Slide element which the dragging began on
   *
   * @param {function} callback
   *
   */

  onDragStart(callback) {
    this.on.dragStart = callback
  }

  /**
   * Fires when dragging ends
   *
   * Callback params (destructured)
   *
   * - `fromIndex` Number of the slide the draggging began on
   * - `fromEl` Slide element which the dragging began on
   * - `toIndex` Number of the slide the dragging stopped on
   * - `toEl` Slide element which dragging stopped on
   *
   * @param {function} callback
   */

  onDragEnd(callback) {
    this.on.dragEnd = callback
  }

  /**
   * Fires when a slide is clicked
   *
   * Callback params (destructured)
   *
   * - `index` Number of the clicked slide
   * - `el` Clicked slide element
   *
   * @param {function} callback
   */

  onSlideClick(callback) {
    this.on.slideClick = callback
  }

  /**
   * If only callback is provided, it will trigger whenever a slide is changed. Otherwise triggered if the provided location is affected.
   *
   * Callback params (destructured)
   *
   * - `fromIndex` Number of the slide the draggging began on
   * - `fromEl` Slide element which the dragging began on
   * - `toIndex` Number of the slide the dragging stopped on
   * - `toEl` Slide element which dragging stopped on
   *
   * @param {button | dot | drag} location Specify which event to watch for
   * @param {function} callback
   */

  onSlideChange(location, callback) {
    if (!callback) {
      this.on.slideChange = location
    } else {
      switch (location) {
        case "button": {
          this.on.slideChangeFromButton = callback
          break
        }
        case "dot": {
          this.on.slideChangeFromDot = callback
          break
        }
        case "drag": {
          this.on.slideChangeFromDrag = callback
          break
        }
      }
    }
  }
}

export default Slider
