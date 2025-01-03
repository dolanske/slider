# TODO

- [ ] [Slider] Implement .config() method which updates slider without reloading it (keeping appened elements etc)
  - [x] enabled
  - [] width
  - [] height
  - [] gap
  - [x] active
  - [] dots
  - [] buttons
  - [] vertical
  - [x] arrows
  - [x] transition
  - [] style
  - [] class
  - [] custom
  - [x] on
- [ ] [Slider] Implement vertical slider
- [ ] [Slider] Implement calculation of showing multiple slides in 1 "slide"
- [ ] [Slider] Test every method

- [ ] [HTML] Clean up index.html and provide simple example

- [x] [slider] Fix not resizing properly
- [ ] Init VITE, add vitest + convert to typescript (v2.0)
- [ ] Add vue wrapper

## Optional

- [ ] [Slider] Option to set position of dots (top,right,bottom=default, left)
- [ ] [Slider] Option to hide buttons if they are disabled

## Done

- [x] [Buzzcut] Document all options
- [x] [Slider] Add window event to check for resizing. Recalculate styles when it triggers
- [x] [Buzzcut] Add attribute checking for every available option (for deeply nested, use slider-level-deeperlevel syntax)
- [x] [Slider] Implement default class names + using user provided class names
- [x] [Defaults] Complete the defaults object
- [x] [Bug] Sometimes during dragging it skips multiple slides
- [x] [Slider] Add event listener for arrow keys (don't propagate outside of root)
- [x] [Slider] Implement .reverse() method which swaps all slides
- [x] [Bug] Arrows are disabled when only 2 slides are available
- [x] [Defaults] Tweak default CSS
- [x] [Slider] Convert style constants into a function which allows overriding values (essentially a deep merge) + use class names from DEFAULTS and not hardcoded ones. Remove border-radius from default styles and only append if it DEFAULTS.rounded has a value
  - [x] Split all styles to 'root' & 'head'
  - [x] Add 'headless' option. Remove any styling. Users style it themselves

---

## Finalization

- [ ] [Ship] Make project public, create a release 1.0.0
- [ ] [Ship] Add to NPM

## TODO

Slider v2

- NOT a full rewrite, just clean up, rename methods, and improve stuff
- Written in typescript
  - Autocomplete stuff ()
- Written as web component (to avoid style mismatch and whatever)
- CSS modules ?
- Use `eminem` for events