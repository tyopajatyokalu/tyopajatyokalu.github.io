import React, { Component } from 'react';
import './FavoritesList.css';
import _ from 'lodash';
import Favorites from '../services/favorites';

class FavoritesList extends Component {

	renderItems() {
		const { favorites, events } = this.props;
		const favoritedEvents = _.reduce(favorites, (sum, key) => {
			const event = _.find(events, e => Favorites.getKey(e) === key);
			if (event) {
				return sum.concat(event);
			}
			return sum;
		}, []);

		return _.sortBy(favoritedEvents, 'time').map(event => {
			return (
				<div className="FavoritesList--item" key={event.name + event.host}>
					<span className="FavoritesList--item__time">{event.time}</span>
					<div className="FavoritesList--item__text">
						<p className="FavoritesList--item__name">{event.name + ' - ' + event.host}</p>
						<span className="FavoritesList--item__description">{event.description}</span>
					</div>
					<span
						className="FavoritesList--item__remove"
						onClick={() => this.props.onToggleFavorite(event)}
					>
						Poista
					</span>
				</div>
			);
		})
	}

	render() {
		return (
			<div className="FavoritesList">
				{this.renderItems()}
			</div>
		)
	}
}

export default FavoritesList;