import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EventColumn.css';

import Event from './Event';
import EventFilters from '../services/eventFilters';

class EventColumn extends Component {

	static propTypes = {
		title: PropTypes.string,
		time: PropTypes.string,
		events: PropTypes.array,
		id: PropTypes.string,
	}

	renderEvents() {
		const { events, times } = this.props;
		const filtered = EventFilters.getEventsForTimes(events, times);

		if (filtered.length === 0) {
			return (
				<div className="EventColumn--empty">
					<p className="EventColumn--empty__text">0 hakukriteerejä vastaavaa työpajaa</p>
				</div>
			);
		}

		return filtered.map(event => {
			return (
				<Event
					onToggleFavorite={this.props.onToggleFavorite}
					isFavorite={this.props.isFavorite}
					key={event.name + event.host}
					event={event}
				/>
			);
		})
	}

	render() {
		return (
			<div className="EventColumn" id={this.props.id}>
				<h2 className="EventColumn--title">{this.props.title}</h2>
				<div className="EventColumn--events">
					{this.renderEvents()}
				</div>
			</div>
		)
	}
}
{/* <h2 className="EventColumn--title">{this.props.title} <br /><span>{this.props.times.map((e, i) => <p key={i}>{e}</p>)}</span></h2> */}
export default EventColumn;