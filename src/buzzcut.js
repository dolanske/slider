import Slider, { DEFAULTS, isEmpty } from "./slider.js"

const _registry = {}
let didWarn = false

export function get(id) {
  // If no Id is provided
  if (!id) {
    if (!didWarn) {
      console.warn(
        "When using buzzcut API, it is recommended to use a slider ID. Without an ID, the first slider in registry will be selected."
      )
      didWarn = true
    }

    if (Object.keys(_registry).length > 0) {
      return Object.values(_registry)[0]
    } else {
      return null
    }
  }

  return Reflect.get(_registry, id)
}

export function register() {
  // Should be called when dom loads
  document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("[slider]")
    const getAttrVal = (el, name, def = null) => {
      return el.attributes.getNamedItem(name)?.value ?? def
    }

    elements.forEach((el) => {
      const id = el.attributes.getNamedItem("slider")?.value

      const enabled = getAttrVal(el, "slider-enabled", DEFAULTS.enabled)
      const width = Number(getAttrVal(el, "slider-width", DEFAULTS.width))
      const height = Number(getAttrVal(el, "slider-height", DEFAULTS.height))
      const gap = Number(getAttrVal(el, "slider-gap", DEFAULTS.gap))
      const active = getAttrVal(el, "slider-active", DEFAULTS.active)
      const dots = getAttrVal(el, "slider-dots", DEFAULTS.dots)
      const buttons = getAttrVal(el, "slider-buttons", DEFAULTS.buttons)
      const transition = {
        time: getAttrVal(
          el,
          "slider-transition-time",
          DEFAULTS.transition.time
        ),
        mode: getAttrVal(el, "slider-transition-mode", DEFAULTS.transition.mode)
      }
      const vertical = getAttrVal(el, "slider-vertical", DEFAULTS.vertical)
      const arrows = getAttrVal(el, "slider-arrows", DEFAULTS.arrows)
      const style = {
        root: getAttrVal(el, "slider-style-root", DEFAULTS.style.root),
        buttons: getAttrVal(el, "slider-style-buttons", DEFAULTS.style.buttons),
        dots: getAttrVal(el, "slider-style-dots", DEFAULTS.style.dots),
        headless: getAttrVal(el, "slider-style-headless", DEFAULTS.style.dots)
      }
      const cls = {
        slider: getAttrVal(el, "slider-class-slider", DEFAULTS.class.slider),
        slide: getAttrVal(el, "slider-class-slide", DEFAULTS.class.slide),
        dots: getAttrVal(el, "slider-class-dots", DEFAULTS.class.dots),
        dot: getAttrVal(el, "slider-class-dot", DEFAULTS.class.dot),
        buttons: getAttrVal(el, "slider-class-buttons", DEFAULTS.class.buttons),
        buttonLeft: getAttrVal(
          el,
          "slider-class-button-left",
          DEFAULTS.class.buttonLeft
        ),
        buttonRight: getAttrVal(
          el,
          "slider-class-button-right",
          DEFAULTS.class.buttonRight
        )
      }
      const mountTo = getAttrVal(el, "slider-mount-to")

      if (
        el.attributes.getNamedItem("slider-custom-dots")?.value ||
        el.attributes.getNamedItem("slider-custom-buttons")?.value
      ) {
        console.warn(
          "When using Buzzcut API, you can not use the <custom> or <on> options"
        )
      }

      const slider = new Slider(
        el,
        {
          enabled,
          width,
          height,
          gap,
          active,
          dots,
          buttons,
          transition,
          vertical,
          arrows,
          style,
          cls
        },
        mountTo
      )

      const identifier = isEmpty(id) ? Symbol.for(Date.now().toString()) : id

      Reflect.set(_registry, identifier, slider)
    })
  })
}

const invalidUse = (id, func) =>
  console.err(`Invalid id of <${id}> used for the ${func} function.`)

export function next(id, by) {
  const slider = get(id)
  if (!slider) invalidUse(id, "next()")

  slider.next(by)
}

export function prev(id, by) {
  const slider = get(id)
  if (!slider) invalidUse(id, "prev()")

  slider.prev(by)
}

export function set(id, func) {
  const slider = get(id)
  if (!slider) invalidUse(id, "set()")

  slider.set(func)
}

export function add(id, slide, index = null) {
  const slider = get(id)
  if (!slider) invalidUse(id, "add()")

  slider.add(slide, index)
}

export function remove(id, index) {
  const slider = get(id)
  if (!slider) invalidUse(id, "remove()")

  slider.remove(index)
}

export function disable(id) {
  const slider = get(id)
  if (!slider) invalidUse(id, "disable()")

  slider.disable()
}

export function enable(id) {
  const slider = get(id)
  if (!slider) invalidUse(id, "enable()")

  slider.enable()
}

export function reverse(id) {
  const slider = get(id)
  if (!slider) invalidUse(id, "reverse()")

  slider.reverse()
}

export function toggle(id) {
  const slider = get(id)
  if (!slider) invalidUse(id, "toggle()")

  slider.toggle()
}

export function onDragStart(id, callback) {
  const slider = get(id)
  if (!slider) invalidUse(id, "onDragStart()")

  slider.onDragStart(callback)
}

export function onDragEnd(id, callback) {
  const slider = get(id)
  if (!slider) invalidUse(id, "onDragEnd()")

  slider.onDragEnd(callback)
}

export function onSlideClick(id, callback) {
  const slider = get(id)
  if (!slider) invalidUse(id, "onSlideClick()")

  slider.onSlideClick(callback)
}

export function onSlideChange(id, from, callback) {
  const slider = get(id)
  if (!slider) invalidUse(id, "onSlideChange()")

  slider.onSlideChange(from, callback)
}
