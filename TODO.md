# TODO

- [ ] [Slider] Implement .config() method which updates slider without reloading it (keeping appened elements etc)
- [ ] [Slider] Implement vertical slider
- [ ] [Slider] Add option to add border radius to the entire slider
- [ ] [Slider] Implement calculation of showing multiple slides in 1 "slide"
- [ ] [Slider] Test every method

- [ ] [Buzzcut] Document all options
- [ ] [HTML] Clean up index.html and provide simple example
- [ ] [Slider] Convert style constants into a function which allows overriding values (essentially a deep merge) + use class names from DEFAULTS and not hardcoded ones. Remove border-radius from default styles and only append if it DEFAULTS.rounded has a value

## Optional

- [ ] [Slider] Option to set position of dots (top,right,bottom=default, left)
- [ ] [Slider] Option to hide buttons if they are disabled

## Done

- [x] [Slider] Add window event to check for resizing. Recalculate styles when it triggers
- [x] [Buzzcut] Add attribute checking for every available option (for deeply nested, use slider-level-deeperlevel syntax)
- [x] [Slider] Implement default class names + using user provided class names
- [x] [Defaults] Complete the defaults object
- [x] [Bug] Sometimes during dragging it skips multiple slides
- [x] [Slider] Add event listener for arrow keys (don't propagate outside of root)
- [x] [Slider] Implement .reverse() method which swaps all slides
- [x] [Bug] Arrows are disabled when only 2 slides are available
- [x] [Defaults] Tweak default CSS

---

## Finalization

- [ ] [Ship] Make project public, create a release 1.0.0
- [ ] [Ship] Add to NPM
