import Slider, { DEFAULTS } from "./slider.js"

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

    elements.forEach((element) => {
      // TODO: add option for every single option
      const id = element.attributes.getNamedItem("slider")?.value

      const width = Number(
        element.attributes.getNamedItem("slider-width")?.value ?? DEFAULTS.width
      )
      const height = Number(
        element.attributes.getNamedItem("slider-height")?.value ??
          DEFAULTS.height
      )
      const gap = Number(
        element.attributes.getNamedItem("slider-gap")?.value ?? DEFAULTS.gap
      )
      const active =
        element.attributes.getNamedItem("slider-slide")?.value ??
        DEFAULTS.active
      const dots =
        element.attributes.getNamedItem("slider-dots")?.value ?? DEFAULTS.dots
      const buttons =
        element.attributes.getNamedItem("slider-buttons")?.value ??
        DEFAULTS.buttons

      const slider = new Slider(
        id ?? Symbol(),
        {
          width,
          height,
          gap,
          active,
          dots,
          buttons
        },
        element
      )

      Reflect.set(_registry, id, slider)
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
