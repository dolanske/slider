// prettier-ignore
import Slider, { DEFAULTS } from "./slider.js"

const _registry = {}

export function get(id) {
  if (!id) return _registry
  return Reflect.get(_registry, id)
}

export function register() {
  // Should be called when dom loads
  const elements = document.querySelectorAll("[slider]")

  elements.forEach((element) => {
    const id = element.attributes.getNamedItem("slider")?.value

    const width = Number(
      element.attributes.getNamedItem("slider-width")?.value ?? DEFAULTS.width
    )
    const height = Number(
      element.attributes.getNamedItem("slider-height")?.value ?? DEFAULTS.height
    )
    const gap = Number(
      element.attributes.getNamedItem("slider-gap")?.value ?? DEFAULTS.gap
    )
    const active =
      element.attributes.getNamedItem("slider-slide")?.value ?? DEFAULTS.active
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
}

const noIdWarning = () =>
  console.warn("Using buzzcut functions requires a slider id.")
const invalidUse = (id, func) =>
  console.warn(`Invalid id of <${id}> used for the ${func} function.`)

export function next(id, by) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "next()")

  slider.next(by)
}

export function prev(id, by) {
  if (!id) console.warn("Using buzzcut functions requires a slider id.")
  const slider = get(id)
  if (!slider) invalidUse(id, "prev()")

  slider.prev(by)
}

export function set(id, func) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "set()")

  slider.set(func)
}

export function add(id, slide, index = null) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "add()")

  slider.add(slide, index)
}

export function remove(id, index) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "remove()")

  slider.remove(index)
}

export function disable(id) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "disable()")

  slider.disable()
}

export function enable(id) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "enable()")

  slider.enable()
}

export function toggle(id) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "toggle()")

  slider.toggle()
}

export function onDragStart(id, callback) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "onDragStart()")

  slider.onDragStart(callback)
}

export function onDragEnd(id, callback) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "onDragEnd()")

  slider.onDragEnd(callback)
}

export function onSlideClick(id, callback) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "onSlideClick()")

  slider.onSlideClick(callback)
}

export function onSlideChange(id, from, callback) {
  if (!id) noIdWarning()
  const slider = get(id)
  if (!slider) invalidUse(id, "onSlideChange()")

  slider.onSlideChange(from, callback)
}
