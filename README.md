# NYC Rent-Stabilized Apartment Lease Renewal Calculator

If you live in a [rent-stabilized apartment in New York City](https://amirentstabilized.com/), and your lease is up for renewal on September 1st, this calculator can help pick the lease duration. See [here](http://streeteasy.com/talk/discussion/27124-lease-options-in-a-rent-stabilized-apt) and [here](http://www.lesliebeslie.com/2012/12/17/lets-talk-about-lease-renewal-rent-stabilization/) for more information.

You can see the calculator [here](https://ghostwords.github.io/NYCRentCalculator/).


## Bugs

- Editing rent can result in a rent == 0 which immediately displays the "all options are the same message"
- Clicking estimated rates button first results in instant submit as soon as values are entered for both inputs
- Estimated rates button needs styling
- Back button should take you back to estimated rates screen


## TODOs

- Builds are not (no longer?) idempotent
- Review [eslint-plugin-react rules](https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules)
- Better live coding setup! This one takes forever to reload.
- Review Babel features
- Review React changelog


## Code license

Mozilla Public License Version 2.0
