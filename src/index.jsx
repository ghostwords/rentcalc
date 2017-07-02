/*!
 * NYCRentCalculator
 *
 * Copyright 2017 ghostwords.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

var React = require('react');
var ReactDOM = require('react-dom');

function number_format(num, decimals) {
  if (decimals === undefined) {
    decimals = 2;
  }
  return parseFloat(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var RGB_DATA = {
  2015: { one: 1, two: 2.75 },
  2016: { one: 0, two: 2 },
  2017: { one: 0, two: 2 },
  2018: { one: 1.25, two: 2 },
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      rateOne: "",
      rateTwo: "",
      rent: '2000.00',
      showDetails: false,
      useProposedRates: false,
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
      var rate_input = document.getElementById("rent-div");
      if (rate_input) {
        window.scroll(0, window.pageYOffset + rate_input.getBoundingClientRect().top);
      }
    }, 100);
  }

  render() {
    var header = (<div>
      <h1>NYC Rent-Stabilized Apartment<br />Lease Renewal Calculator</h1>
      If you live in a rent-stabilized apartment in New York City, and your lease is up for renewal around September 1st, this calculator can help pick the lease duration.
    </div>);

    var footer = (<div>
      <h2>Resources</h2>
      <ul>
        <li><a href="http://streeteasy.com/talk/discussion/27124-lease-options-in-a-rent-stabilized-apt" target="_blank" rel="noopener noreferrer">Lease Options in a Rent-Stabilized Apt</a></li>
        <li><a href="http://www.lesliebeslie.com/2012/12/17/lets-talk-about-lease-renewal-rent-stabilization/" target="_blank" rel="noopener noreferrer">Let’s Talk About Lease Renewal &amp; Rent Stabilization</a></li>
        <li><a href="https://amirentstabilized.com/" target="_blank" rel="noopener noreferrer">Am I Rent-Stabilized?</a></li>
        <li><a href="http://www.nycrgb.org/" target="_blank" rel="noopener noreferrer">NYC Rent Guidelines Board</a></li>
      </ul>
    </div>);

    var year = (new Date()).getFullYear();

    if (!RGB_DATA.hasOwnProperty(year)) {
      return (<div>
        {header}
        <div className="notice">
          <p>Oops, we don&apos;t have NYC Rent Guidelines Board apartment lease renewal rates for {year}.</p>
          <p>Looks like this app is way out of date.</p>
        </div>
        {footer}
      </div>);
    }

    if (!RGB_DATA.hasOwnProperty(year + 1) && !this.state.useProposedRates) {
      return (<div>
        {header}
        <div className="notice">
          <p>We don&apos;t have NYC Rent Guidelines Board apartment lease renewal rates for {year+1}. You could check their <a href="http://www.nycrgb.org/html/guidelines/apt.html" target="_blank" rel="noopener noreferrer">website</a> for proposed rates.</p>
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
              onClick={this.useProposedRates.bind(this)} />
          </p>
        </div>
        {footer}
      </div>);
    }

    var rent = parseFloat(this.state.rent) || 0,
      rent_1y = rent / 100 * RGB_DATA[year].one + rent,
      rent_2y = rent / 100 * RGB_DATA[year].two + rent;

    var next_one_year_rate = this.state.rateOne === "" ?
      RGB_DATA[year + 1].one : this.state.rateOne;
    var next_two_year_rate = this.state.rateTwo === "" ?
      RGB_DATA[year + 1].two : this.state.rateTwo;

    var rent_1y_1y = rent_1y / 100 * next_one_year_rate + rent_1y,
      rent_1y_2y = rent_1y / 100 * next_two_year_rate + rent_1y,
      totals = [
        rent_1y * 12 + rent_1y_1y * 12,
        rent_1y * 12 + rent_1y_2y * 12,
        rent_2y * 12 + rent_2y * 12
      ],
      totals_min = Math.min(...totals),
      totals_max = Math.max(...totals),
      totals_classes = {
        [totals_min]: 'min-total',
        [totals_max]: 'max-total'
      };

    var rent_input;
    if (totals_max - totals_min || this.state.showDetails) {
      rent_input = (<div id="rent-div">
        <label htmlFor="rent">Enter your current rent:</label>
        $ <input
          type="number"
          step="0.01"
          id="rent"
          name="rent"
          value={this.state.rent}
          onChange={this.handleChange.bind(this)}
          autoComplete="off" /> / mo

        <input
          type="button"
          id="update-button"
          value="Update"
          onClick={this.handleButton.bind(this)}
          style={{
            float: "right"
          }}/>

        <hr />
      </div>);
    }

    var summary;
    if (totals_max - totals_min) {
      var cheapest_option;
      if (totals[0] == totals_min) {
        cheapest_option = (<span>
          <b>one year</b> renewal followed by another <b>one year</b> renewal
        </span>);
      } else if (totals[1] == totals_min) {
        cheapest_option = (<span>
          <b>one year</b> renewal followed by a <b>two year</b> renewal
        </span>);
      } else if (totals[2] == totals_min) {
        cheapest_option = <span><b>two year</b> renewal</span>;
      }

      summary = (
        <p>
          You will save <b>${number_format(totals_max - totals_min)}</b> over two years by going with a {cheapest_option}.
        </p>
      );
    } else if (!this.state.showDetails) {
      summary = (
        <p>
          All your lease options work out to the same amount given {year} and {year + 1} rent adjustment rates. Moneywise, it doesn&apos;t matter which one you pick.
        </p>
      );
    }

    var details = (
      <p><a href="/" onClick={this.showDetails.bind(this)}>Show me the details.</a></p>
    );

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
              <td className={totals_classes.hasOwnProperty(totals[0]) && totals_classes[totals[0]]}>
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
              <td className={totals_classes.hasOwnProperty(totals[1]) && totals_classes[totals[1]]}>
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
              <td className={totals_classes.hasOwnProperty(totals[2]) && totals_classes[totals[2]]}>
                ${number_format(totals[2])}
                <div className="monthly-rent">${number_format(totals[2] / 24)} / mo</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>);
    }

    return (
      <div>
        {header}

        <hr />

        {rent_input}

        {summary}

        {details}

        <hr />

        {footer}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));
