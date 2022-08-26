"use strict"

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

function noop() {}

const minDiff = (a, b, v) => Math.abs(a - b) > v && Math.abs(b - a) > v
const isNil = (v) => v === undefined || v === null
const isFunc = (v) => Object.prototype.toString.call(v) == "[object Function]"
const isEl = (v) =>
  typeof HTMLElement === "object"
    ? v instanceof HTMLElement
    : v &&
      typeof v === "object" &&
      v !== null &&
      v.nodeType === 1 &&
      typeof v.nodeName === "string"

/*----------  Main Slider Class  ----------*/

// configuration
// TODO: implement
// TODO: refactor all slider properties to be more clear

// TODO: move the class name settings to the configuration
// const SLIDER_CLASS = "slider"
// const DOTS_CLASS = "slider-dots"
// const DOT_CLASS = "slider-dot"

export const DEFAULTS = {
  width: 512,
  height: 256,
  gap: 16,
  active: 0,
  dots: true,
  buttons: true
}

class Slider {
  constructor(id, options, element) {
    this.config = {
      enabled: true,
      width: DEFAULTS.width,
      height: DEFAULTS.height,
      gap: DEFAULTS.gap,
      active: DEFAULTS.active,
      dots: DEFAULTS.dots,
      buttons: DelayNode.buttons,
      // TODO
      // direction: "row",
      // TODO
      // reverse: false,
      transition: { time: 0.3, mode: "ease" },
      // TODO
      style: {
        slide: null,
        buttons: null,
        dots: null
      },

      // TODO: Implement custom elements for navigation
      custom: {
        dots: "",
        buttons: ""
      }
      // TODO
      // Implement callbacks
    }

    Object.assign(this.config, options)

    this.ready = false
    this.id = id
    this.root = element ?? null
    this.wrap = null
    this.slides = null
    this.dots = null
    this.active = this.config.active
    this.style = null
    this.dragging = false
    this.dragStart = 0
    this.fromLeft = 0

    this.changedBy = ""

    this.events = {
      onDragStart: noop,
      onDragEnd: noop,
      onSlideClick: noop,
      onSlideChange: noop,
      onSlideChangeFromButton: noop,
      onSlideChangeFromDot: noop,
      onSlideChangeFromDrag: noop
    }

    this.left = {
      el: document.createElement("button"),
      by: 1
    }

    this.right = {
      el: document.createElement("button"),
      by: 1
    }
    this.dots = null

    this._init()
  }

  /*----------  Private API  ----------*/

  _init() {
    this.root = this.root || document.querySelector(this.id)

    if (!this.root) {
      throw new Error(
        `Did not find element with the id ${this.id}. Make sure your body contains <div id="${this.id}"></div> \n\n`
      )
    }
    // Wrap inner children in a new element which will handle touch screens
    const org_html = this.root.innerHTML
    const new_html = "<div id='slider-wrapper'>" + org_html + "</div>"
    this.root.innerHTML = new_html
    this.root.classList.add("slider")
    this.wrap = this.root.children[0]
    this.slides = this.wrap.children

    // Prepare slide sizing
    // NOTE: should get a slide property which is not tied to a slide itself
    // The reason for that is, if we show 2 divs per slide, then suddenly we'll
    // have to divide the number of active slides / dots etc. by the amount
    // of "slides" per slide
    if (this.config.slides > 1) {
      // TODO: if more than 1 slide is showing, must calculate slide width based on that
      // IMPLEMENT
    } else {
      this.slideWidth = this.config.width
    }

    // Create style element and append it to the head to store dynamic styles
    this.style = document.createElement("style")
    document.head.appendChild(this.style)

    this._calculateWrapperStyle()

    if (this.config.buttons) {
      this.left.el.setAttribute("id", "slider-button-left")
      this.right.el.setAttribute("id", "slider-button-right")

      this.left.el.addEventListener("click", () => {
        this.changedBy = "button"
        this.prev(this.left.by)
      })
      this.right.el.addEventListener("click", () => {
        this.changedBy = "button"
        this.next(this.right.by)
      })

      this.root.appendChild(this.left.el)
      this.root.appendChild(this.right.el)
    }

    // Handle dragging
    this.wrap.addEventListener("mousedown", (e) => this._handleDragStart(e))
    this.wrap.addEventListener("mousemove", (e) => this._handleDragMove(e))
    this.wrap.addEventListener("mouseup", (e) => this._handleDragEnd(e))

    // this.wrap.addEventListener("mouseleave", (e) => this._handleMouseLeave(e))
    for (const slide of this.slides) {
      slide.addEventListener("click", (e) => this._handleSlideClick(e))
    }

    this._generateDots()
    this._updateNav(this.active)
    this.ready = true
  }

  _currentDragPos(e) {
    return Math.abs(this.root.getBoundingClientRect().left - e.clientX)
  }

  _handleDragStart(e) {
    this.wrap.classList.add("slider-disable-transition")
    this.dragging = true
    this.dragStart = this._currentDragPos(e)
    this.events.onDragStart(e, {
      fromIndex: this.active,
      fromEl: this.slides[this.active]
    })
  }

  _handleDragEnd(e) {
    this.wrap.classList.remove("slider-disable-transition")
    this.dragging = false

    const from = this.active

    const dragEnd = this._currentDragPos(e)

    if (minDiff(this.dragStart, dragEnd, 15)) {
      this.changedBy = "drag"

      if (this.dragStart < dragEnd) {
        this.prev()
      } else {
        this.next()
      }

      this.events.onDragEnd(e, {
        fromIndex: from,
        fromEl: this.slides[from],
        toIndex: this.active,
        toEl: this.slides[this.active]
      })
    }
  }

  _handleDragMove(e) {
    // TODO: if mouse leaves the slider element, stop dragging
    if (this.dragging) {
      const pos = this._currentDragPos(e)

      if (minDiff(this.dragStart, pos, 15)) {
        const move = this.dragStart - pos
        setStyle(this.wrap, "left", this.fromLeft + move * -1, "px")
      }
    }
  }

  _handleSlideClick(e) {
    this.events.onSlideClick(e, {
      index: this.active,
      el: this.slides[this.active]
    })
  }

  // _handleMouseLeave(e) {
  //   this.dragging = false
  //   this._handleDragEnd(e)
  // }

  // During recalculation, clear all dynamic styling
  _calculateWrapperStyle() {
    this.style.replaceChildren()

    setStyle(this.root, "width", this.config.width, "px")
    setStyle(this.root, "height", this.config.height, "px")

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
      this.config.width * this.slides.length +
        this.slides.length * this.config.gap,
      "px"
    )

    for (const slide of this.slides) {
      setStyle(slide, "width", this.config.width, "px")
      setStyle(slide, "height", this.config.height, "px")
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
      this.dots.classList.add("slider-dots")

      // Loop over each slide and create a button for it
      for (let i = 0; i < this.slides.length; i++) {
        const dot = document.createElement("button")

        dot.classList.add("slider-dot")
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
    if (index + 1 === this.slides.length) {
      this.right.el.setAttribute("disabled", true)
    } else if (index === 0) {
      this.left.el.setAttribute("disabled", true)
    } else {
      // Enable again
      this.right.el.removeAttribute("disabled")
      this.left.el.removeAttribute("disabled")
    }

    if (this.config.dots) {
      // this.dots.children[index]
      for (let i = 0; i < this.slides.length; i++) {
        if (i === index) {
          this.dots.children[i].classList.add("active")
        } else {
          this.dots.children[i].classList.remove("active")
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
        this.events.onSlideChangeFromButton(changeEventObject)
        break
      }
      case "dot": {
        this.events.onSlideChangeFromDot(changeEventObject)
        break
      }
      case "drag": {
        this.events.onSlideChangeFromDrag(changeEventObject)
        break
      }
    }

    this.events.onSlideChange({
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
   * @param {Number} by specifies how many slides to jump, default is 1
   */
  next(by = 1) {
    this._set(this.active + by)
  }

  /**
   * Goes to the previous slide unless it's the first slide
   *
   * @public
   * @param {Number} by specifies how many slides to jump, default is 1
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
      throw new Error("Invalid input")
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
        throw new Error("You must return a number in the set() function")
      }

      this._set(index)
    }
  }

  /**
   * Appends a slide to the slider.
   *
   * @param {Function | string | HTMLElement} slide
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
      // Create a dummy element & assign the element as its inner html
      const temp_el = document.createElement("div")
      temp_el.innerHTML = slide

      // grap the first child of dummy element
      this.add(temp_el.firstChild, index)
    } else if (isFunc(slide)) {
      // We insert a function which should return a string or a html node

      const el = slide({
        index: this.active,
        total: this.slides.length
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

    this._calculateWrapperStyle()
    this._generateDots()
    this._updateNav(this.active)
    this.slides = this.wrap.children
  }

  /**
   *
   * @param {*} index
   * @returns
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

    this._calculateWrapperStyle()
    this._generateDots()
    this._updateNav(this.active)
  }

  enable() {
    this.config.enabled = true
    this.root.style.pointerEvents = "all"
  }

  toggle() {
    if (this.config.enableed) {
      this.disable()
    } else {
      this.enable()
    }
  }

  config(conf) {
    // TODO: assign new settings, re-render slider
    // while keeping active slide
  }

  swap() {
    // TODO
    // Swaps all children
  }

  disable() {
    this.config.enabled = false
    this.root.style.pointerEvents = "none"
  }

  /*----------  Events  ----------*/

  onDragStart(callback) {
    this.events.onDragStart = callback
  }

  onDragEnd(callback) {
    this.events.onDragEnd = callback
  }

  onSlideClick(callback) {
    this.events.onSlideClick = callback
  }

  onSlideChange(from, callback) {
    if (!callback) {
      this.events.onSlideChange = from
    } else {
      switch (from) {
        case "button": {
          this.events.onSlideChangeFromButton = callback
          break
        }
        case "dot": {
          this.events.onSlideChangeFromDot = callback
          break
        }
        case "drag": {
          this.events.onSlideChangeFromDrag = callback
          break
        }
      }
    }
  }
}

export default Slider
