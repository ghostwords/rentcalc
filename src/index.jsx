/*!
 * NYCRentCalculator
 *
 * Copyright 2015 ghostwords.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

var React = require('react');

function number_format(num, decimals) {
	if (decimals === undefined) {
		decimals = 2;
	}
	return parseFloat(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var RGB_DATA = {
	// http://www.nycrgb.org/html/guidelines/orders/order46.html
	2015: {
		'one': 1,
		'two': 2.75
	},
	// http://www.nycrgb.org/html/guidelines/orders/order47.html
	2016: {
		'one': 0,
		'two': 2
	}
};

var App = React.createClass({
	getInitialState: function () {
		return {
			rent: '2000'
		};
	},

	handleChange: function (event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	},

	render: function () {
		var year = (new Date()).getFullYear();

		if (!RGB_DATA.hasOwnProperty(year) || !RGB_DATA.hasOwnProperty(year + 1)) {
			return (
				<div>
					Sorry, we don't have NYC Rent Guidelines Board apartment lease renewal rates for {year} and {year+1}.
				</div>
			);
		}

		var rent = parseFloat(this.state.rent) || 0,
			this_one_pct = rent / 100,
			this_year_one = this_one_pct * RGB_DATA[year].one + rent,
			this_year_two = this_one_pct * RGB_DATA[year].two + rent,
			next_one_pct = this_year_one / 100,
			next_year_one = next_one_pct * RGB_DATA[year + 1].one + this_year_one,
			next_year_two = next_one_pct * RGB_DATA[year + 1].two + this_year_one,
			totals = [
				this_year_one * 12 + next_year_one * 12,
				this_year_one * 12 + next_year_two * 12,
				this_year_two * 12 + this_year_two * 12
			],
			totals_min = Math.min(...totals),
			totals_max = Math.max(...totals),
			totals_classes = {
				[totals_min]: 'min-total',
				[totals_max]: 'max-total'
			},
			totals_rows = [];

		totals.forEach(function (total, i) {
			totals_rows.push(
				<td key={i}
					className={totals_classes.hasOwnProperty(total) &&
					totals_classes[total]}>${number_format(total)}</td>
			);
		}, this);

		return (
			<div>
				<h1>
					2015 NYC <a href="http://www.nycrgb.org/">Rent Guidelines Board</a>
					<br />Apartment Lease Renewal Calculator
				</h1>
				If you live in a rent-stabilized apartment in New York City, and your lease is up for renewal on September 1st, this calculator can help. See <a href="http://streeteasy.com/talk/discussion/27124-lease-options-in-a-rent-stabilized-apt">here</a> and <a href="http://www.lesliebeslie.com/2012/12/17/lets-talk-about-lease-renewal-rent-stabilization/">here</a> for more information.
				<hr />
				<label htmlFor="rent">Enter your current rent:</label>
				$ <input
					type="text"
					id="rent"
					name="rent"
					value={this.state.rent}
					onChange={this.handleChange}
					autoComplete="off" /> per month

				<hr />

				<table>
					<caption>Your totals:</caption>
					<tr>
						<th style={{backgroundColor: '#fff'}}></th>
						<th>1y, then 1y</th>
						<th>1y, then 2y</th>
						<th>2y lease</th>
					</tr>
					<tr>
						<th scope="row">first year</th>
						<td>${number_format(this_year_one * 12)}</td>
						<td>${number_format(this_year_one * 12)}</td>
						<td>${number_format(this_year_two * 12)}</td>
					</tr>
					<tr>
						<th scope="row">next year</th>
						<td>${number_format(next_year_one * 12)}</td>
						<td>${number_format(next_year_two * 12)}</td>
						<td>${number_format(this_year_two * 12)}</td>
					</tr>
					<tr>
						<th scope="row">total</th>
						{totals_rows}
					</tr>
				</table>

				Your new rent will be
				${number_format(this_year_one)} per month
				if you renew for one year, and
				${number_format(this_year_two)} per month
				if you renew for two.
				<br />
				<br />
				If you renew for one year,
				your choices next year are between
				${number_format(next_year_one)} for one year
				and ${number_format(next_year_two)} for two years.
				<br />
				<br />
				You will save ${number_format(totals_max - totals_min)} over two years by going with the cheapest option.
			</div>
		);
	}
});

React.render(<App />, document.getElementById('content'));
