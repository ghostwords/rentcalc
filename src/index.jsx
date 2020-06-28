/*!
 * NYCRentCalculator
 *
 * Copyright 2020 ghostwords.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

let React = require('react');
let ReactDOM = require('react-dom');

function number_format(num, decimals) {
  if (decimals === undefined) {
    decimals = 2;
  }
  return parseFloat(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let RGB_DATA = {
  2011: { one: 2.25, two: 4.5 },
  2012: { one: 3.75, two: 7.25 },
  2013: { one: 2, two: 4 },
  2014: { one: 4, two: 7.75 }, // order #45
  2015: { one: 1, two: 2.75 }, // #46
  2016: { one: 0, two: 2 }, // #47
  2017: { one: 0, two: 2 }, // #48
  2018: { one: 1.25, two: 2 }, // #49
  2019: { one: 1.5, two: 2.5 }, // #50
  2020: { one: 1.5, two: 2.5 }, // #51
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      rateOne: "",
      rateTwo: "",
      rent: "",
      showDetails: false,
      useProposedRates: false,
      year: (new Date()).getFullYear(),
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleButton() {
    this.setState({
      rent: document.getElementById('rent').value
    });
  }

  showDetails(e) {
    this.setState({
      showDetails: true
    });
    e.preventDefault();
  }

  useProposedRates() {
    this.setState({
      useProposedRates: true
    });
    setTimeout(function () {
      let rate_input = document.getElementById("rent-div");
      if (rate_input) {
        window.scroll(0, window.pageYOffset + rate_input.getBoundingClientRect().top);
      }
    }, 100);
  }

  render() {
    const year = +this.state.year;

    let years = [];
    Object.keys(RGB_DATA).reverse().forEach(i => {
      years.push(<option key={i} value={i}>{i}</option>);
    });

    let header = (<header>
      <h1>&#127968; NYC Rent-Stabilized Apartment<br />Lease Renewal Calculator</h1>
      If you live in a rent-stabilized apartment in New York City, and your lease is up for renewal in <select
        id="year"
        name="year"
        onChange={this.handleChange.bind(this)}
        value={year}>{years}</select> around September 1st, this calculator can help pick the lease duration.
    </header>);

    let footer = (<footer>
      <h2>Resources</h2>
      <ul>
        <li><a href="http://streeteasy.com/talk/discussion/27124-lease-options-in-a-rent-stabilized-apt" target="_blank" rel="noopener noreferrer">Lease Options in a Rent-Stabilized Apt</a></li>
        <li><a href="http://www.lesliebeslie.com/2012/12/17/lets-talk-about-lease-renewal-rent-stabilization/" target="_blank" rel="noopener noreferrer">Let’s Talk About Lease Renewal &amp; Rent Stabilization</a></li>
        <li><a href="https://amirentstabilized.com/" target="_blank" rel="noopener noreferrer">Am I Rent-Stabilized?</a></li>
        <li><a href="https://portal.hcr.ny.gov/app/ask" target="_blank" rel="noopener noreferrer">Request your apartment&rsquo;s rent history from NYS HCR</a></li>
        <li><a href="https://rentguidelinesboard.cityofnewyork.us/" target="_blank" rel="noopener noreferrer">NYC Rent Guidelines Board</a></li>
      </ul>
      <hr />
      <div className="credits">
        &copy; 2020 ghostwords / <a href="https://github.com/ghostwords/rentcalc" target="_blank" rel="noopener noreferrer">source code on GitHub</a>
      </div>
    </footer>);

    if (!(year in RGB_DATA)) {
      return (<div>
        {header}
        <div className="notice">
          <p>Oops, we don&rsquo;t have NYC Rent Guidelines Board apartment lease renewal rates for {year}.</p>
          <p>Looks like this app is way out of date.</p>
        </div>
        {footer}
      </div>);
    }

    if (!((year + 1) in RGB_DATA) && !this.state.useProposedRates) {
      return (<div>
        {header}
        <div className="notice">
          <p>We don&rsquo;t yet have apartment lease renewal rates for {year+1}.</p>
          <p>You could check the <a href="https://rentguidelinesboard.cityofnewyork.us/" target="_blank" rel="noopener noreferrer">NYC Rent Guidelines Board website</a> for proposed rates.</p>
          <p>
            <label htmlFor="rateOne">One-year renewal lease adjustment for {year + 1}:</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              id="rateOne"
              name="rateOne"
              value={this.state.rateOne}
              onChange={this.handleChange.bind(this)}
              autoComplete="off" />%
          </p>
          <p>
            <label htmlFor="rateTwo">Two-year renewal lease adjustment for {year + 1}:</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              id="rateTwo"
              name="rateTwo"
              value={this.state.rateTwo}
              onChange={this.handleChange.bind(this)}
              autoComplete="off" />%
          </p>
          <p>
            <input
              type="button"
              id="use-proposed-rates-button"
              value="Use proposed rates"
              disabled={!this.state.rateOne || !this.state.rateTwo}
              onClick={this.useProposedRates.bind(this)} />
          </p>
        </div>
        {footer}
      </div>);
    }

    let rent = parseFloat(this.state.rent) || 0,
      rent_1y = rent / 100 * RGB_DATA[year].one + rent,
      rent_2y = rent / 100 * RGB_DATA[year].two + rent;

    let next_one_year_rate = this.state.rateOne === "" ?
      RGB_DATA[year + 1].one : this.state.rateOne;
    let next_two_year_rate = this.state.rateTwo === "" ?
      RGB_DATA[year + 1].two : this.state.rateTwo;

    let rent_1y_1y = rent_1y / 100 * next_one_year_rate + rent_1y,
      rent_1y_2y = rent_1y / 100 * next_two_year_rate + rent_1y,
      totals = [
        rent_1y * 12 + rent_1y_1y * 12,
        rent_1y * 12 + rent_1y_2y * 12,
        rent_2y * 12 + rent_2y * 12
      ],
      totals_min = Math.min(...totals),
      totals_max = Math.max(Math.min(totals[0], totals[1]), totals[2]),
      totals_classes = {};

    if (totals_max - totals_min) {
      totals_classes = {
        [totals_min]: 'min-total',
        //[totals_max]: 'max-total'
      };
    }

    const rent_input = (<div id="rent-div">
      <label htmlFor="rent">Enter your current rent:</label>
      $ <input
        type="number"
        step="0.01"
        id="rent"
        name="rent"
        value={this.state.rent}
        onChange={this.handleChange.bind(this)}
        autoComplete="off"
        autoFocus="autofocus" /> / mo

      <input
        type="button"
        id="update-button"
        value="Update"
        onClick={this.handleButton.bind(this)}
        style={{
          float: "right"
        }} />

      <hr />
    </div>);

    let summary;
    if (totals_max - totals_min) {
      let cheapest_option;
      if (totals[0] == totals_min || totals[1] == totals_min) {
        cheapest_option = <b>one year</b>;
      } if (totals[2] == totals_min) {
        cheapest_option =<b>two year</b>;
      }

      summary = (
        <p>
          You will save <b>${number_format(totals_max - totals_min)}</b> over two years by going with a {cheapest_option} renewal.
        </p>
      );
    } else if (rent > 0 && !this.state.showDetails) {
      summary = (
        <p>
          All your lease options work out to the same amount given {year} and {year + 1} rent adjustment rates. Moneywise, it doesn&rsquo;t matter which one you pick.
        </p>
      );
    }

    let details;
    if (rent > 0) {
      details = (<div>
        <a href="/" onClick={this.showDetails.bind(this)}>Show me the details.</a>
        <hr />
      </div>);
    }

    if (this.state.showDetails) {
      details = (<div>
        <table>
          <caption>One year renewal followed by another one year renewal:</caption>
          <tbody>
            <tr>
              <th scope="row">first year</th>
              <td>
                ${number_format(rent_1y * 12)}
                <div className="monthly-rent">${number_format(rent_1y)} / mo</div>
              </td>
            </tr>
            <tr>
              <th scope="row">next year</th>
              <td>
                ${number_format(rent_1y_1y * 12)}
                <div className="monthly-rent">${number_format(rent_1y_1y)} / mo</div>
              </td>
            </tr>
            <tr>
              <th scope="row">total</th>
              <td className={totals[0] in totals_classes && totals_classes[totals[0]]}>
                ${number_format(totals[0])}
                <div className="monthly-rent">${number_format(totals[0] / 24)} / mo</div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>One year followed by a two year:</caption>
          <tbody>
            <tr>
              <th scope="row">first year</th>
              <td>
                ${number_format(rent_1y * 12)}
                <div className="monthly-rent">${number_format(rent_1y)} / mo</div>
              </td>
            </tr>
            <tr>
              <th scope="row">next year</th>
              <td>
                ${number_format(rent_1y_2y * 12)}
                <div className="monthly-rent">${number_format(rent_1y_2y)} / mo</div>
              </td>
            </tr>
            <tr>
              <th scope="row">total</th>
              <td className={totals[1] in totals_classes && totals_classes[totals[1]]}>
                ${number_format(totals[1])}
                <div className="monthly-rent">${number_format(totals[1] / 24)} / mo</div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>Two year renewal:</caption>
          <tbody>
            <tr>
              <th scope="row">first year</th>
              <td>
                ${number_format(rent_2y * 12)}
                <div className="monthly-rent">${number_format(rent_2y)} / mo</div>
              </td>
            </tr>
            <tr>
              <th scope="row">next year</th>
              <td>
                ${number_format(rent_2y * 12)}
                <div className="monthly-rent">${number_format(rent_2y)} / mo</div>
              </td>
            </tr>
            <tr>
              <th scope="row">total</th>
              <td className={totals[2] in totals_classes && totals_classes[totals[2]]}>
                ${number_format(totals[2])}
                <div className="monthly-rent">${number_format(totals[2] / 24)} / mo</div>
              </td>
            </tr>
          </tbody>
        </table>

        <hr />
      </div>);
    }

    return (
      <div>
        {header}

        <hr />

        {rent_input}

        {summary}

        {details}

        {footer}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));
