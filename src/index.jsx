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
	},
	2017: {
		'one': 0,
		'two': 2
	},
};

var App = React.createClass({
	getInitialState: function () {
		return {
			rent: '2000.00'
		};
	},

	handleChange: function (event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	},

	handleButton: function () {
		this.setState({
			'rent': document.getElementById('rent').value
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
			};

		return (
			<div>
				<h1>NYC Rent-Stabilized Apartment<br />Lease Renewal Calculator</h1>
				If you live in a rent-stabilized apartment in New York City, and your lease is up for renewal on September 1st, this calculator can help pick the lease duration.
				<hr />

				<label htmlFor="rent">Enter your current rent:</label>
				$ <input
					type="number"
					step="0.01"
					id="rent"
					name="rent"
					value={this.state.rent}
					onChange={this.handleChange}
					autoComplete="off" /> / mo

				<input
					type="button"
					id ="update-button"
					value="Update"
					onClick={this.handleButton}
					style={{
						float: "right"
					}}/>

				<hr />

				<table>
					<caption>One year renewal followed by another one year renewal:</caption>
					<tr>
						<th scope="row">first year</th>
						<td>
							${number_format(this_year_one * 12)}
							<div className="monthly-rent">${number_format(this_year_one)} / mo</div>
						</td>
					</tr>
					<tr>
						<th scope="row">next year</th>
						<td>
							${number_format(next_year_one * 12)}
							<div className="monthly-rent">${number_format(next_year_one)} / mo</div>
						</td>
					</tr>
					<tr>
						<th scope="row">total</th>
						<td className={totals_classes.hasOwnProperty(totals[0]) && totals_classes[totals[0]]}>
							${number_format(totals[0])}
							<div className="monthly-rent">${number_format(totals[0] / 24)} / mo</div>
						</td>
					</tr>
				</table>

				<table>
					<caption>One year followed by a two year:</caption>
					<tr>
						<th scope="row">first year</th>
						<td>
							${number_format(this_year_one * 12)}
							<div className="monthly-rent">${number_format(this_year_one)} / mo</div>
						</td>
					</tr>
					<tr>
						<th scope="row">next year</th>
						<td>
							${number_format(next_year_two * 12)}
							<div className="monthly-rent">${number_format(next_year_two)} / mo</div>
						</td>
					</tr>
					<tr>
						<th scope="row">total</th>
						<td className={totals_classes.hasOwnProperty(totals[1]) && totals_classes[totals[1]]}>
							${number_format(totals[1])}
							<div className="monthly-rent">${number_format(totals[1] / 24)} / mo</div>
						</td>
					</tr>
				</table>

				<table>
					<caption>Two year renewal:</caption>
					<tr>
						<th scope="row">first year</th>
						<td>
							${number_format(this_year_two * 12)}
							<div className="monthly-rent">${number_format(this_year_two)} / mo</div>
						</td>
					</tr>
					<tr>
						<th scope="row">next year</th>
						<td>
							${number_format(this_year_two * 12)}
							<div className="monthly-rent">${number_format(this_year_two)} / mo</div>
						</td>
					</tr>
					<tr>
						<th scope="row">total</th>
						<td className={totals_classes.hasOwnProperty(totals[2]) && totals_classes[totals[2]]}>
							${number_format(totals[2])}
							<div className="monthly-rent">${number_format(totals[2] / 24)} / mo</div>
						</td>
					</tr>
				</table>

				You will save ${number_format(totals_max - totals_min)} over two years by going with the cheapest option.

				<hr />

				<h2>Resources</h2>
				<ul>
					<li><a href="http://streeteasy.com/talk/discussion/27124-lease-options-in-a-rent-stabilized-apt">Lease Options in a Rent-Stabilized Apt</a></li>
					<li><a href="http://www.lesliebeslie.com/2012/12/17/lets-talk-about-lease-renewal-rent-stabilization/">Let’s Talk About Lease Renewal &amp; Rent Stabilization</a></li>
					<li><a href="https://amirentstabilized.com/">Am I Rent-Stabilized?</a></li>
					<li><a href="http://www.nycrgb.org/">NYC Rent Guidelines Board</a></li>
				</ul>
			</div>
		);
	}
});

React.render(<App />, document.getElementById('content'));
