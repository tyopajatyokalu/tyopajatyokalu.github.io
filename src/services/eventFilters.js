import _ from 'lodash';

const EventFilters = {

	// TIMES: {
	// 	morning: '11:00-12:30',
	// 	afternoon_long: '14:15-16:45',
	// 	afternoon_short: '14:15-15:45',
	// 	afternoon_keynote: '16:00-16:45'
	// },

	TIMES: {
		morning1: '11:00-12:30',
		morning2: '11:15-12:45',
		morning3: '11:30-13:00',
		afternoon1: '15:00-17:15',
		afternoon2: '15:30-17:00',
		afternoon3: '15:45-17:15',
		afternoon4: '16:00-17:30',
		sunday: 'Sunnuntai'
	},

	// LEVEL_MAPPING: {
	// 	Tutustu: 1,
	// 	Perehdy: 2,
	// 	Syvenny: 3,
	// },

	LEVEL_MAPPING: {
		Perustaso: 1,
		Syventävä: 2,
	},


	filter: (events, levels = [], tags = [], searchText = '') => {
		return events.filter(event => {
			if (levels.length > 0) {
				const matchingLevels = levels.filter(level => {
					return event.level === level;
				})

				if (matchingLevels.length === 0) {
					return false;
				}
			}

			if (tags.length > 0) {
				const matchingTags = tags.filter(tag => {
					return event.tags.indexOf(tag) !== -1;
				});

				if (matchingTags.length === 0) {
					return false;
				}
			}

			if (searchText.length > 0) {
				const toSearch = event.name + '|' + event.description + '|' + event.host;
				if (toSearch.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
					return false;
				}
			}

			return true;
		});
	},

	getEventsForTime: (events, time) => {
		return events.filter(event => event.time === time);
	},

	getEventsForTimes: (events, times) => {
		return events.filter(event => times.indexOf(event.time) !== -1);
	},

	getTags: (events) => {
		const tags = [];

		events.forEach(event => {
			event.tags.forEach(tag => {
				if (tags.indexOf(tag) === -1) {
					tags.push(tag);
				}
			})
		});

		return tags;
	},

	getLevels: (events) => {
		const levels = [];

		events.forEach(event => {
			if (levels.indexOf(event.level) === -1) {
				levels.push(event.level);
			}
		});

		return _.sortBy(levels, l => {
			return EventFilters.LEVEL_MAPPING[l] || 0;
		});
	}
}

export default EventFilters;
