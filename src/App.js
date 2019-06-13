import React, { Component } from 'react';
import './App.css';

import _ from 'lodash';
import { Container, Row, Col } from 'react-grid-system';

import Event from './components/Event';
import EventColumn from './components/EventColumn';
import Filters from './components/Filters';
import HeroImage from './components/HeroImage';
import EventService from './services/eventService';
import EventFilters from './services/eventFilters';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedLevels: [],
      selectedTags: [],
      filtered: [],
      events: [],
      searchText: '',
      loading: true,
      error: false,
    }

    this.handleLevelsChange = this.handleSelectChange('selectedLevels').bind(this);
    this.handleTagsChange = this.handleSelectChange('selectedTags').bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    EventService.getEvents().then(data => {
      this.setState({
        events: _.sortBy(data, 'name'),
        loading: false,
      });
    }).catch(e => {
      this.setState({
        error: true,
        loading: false,
      });
    })
  }

  handleSearchChange(e) {
    this.setState({
      searchText: e.target.value
    });
  }

  handleSelectChange(field) {
    return (selected) => {
      let newValues = this.state[field].slice();

      if (newValues.indexOf(selected) === -1) {
        newValues.push(selected);
      } else {
        newValues = newValues.filter(v => v !== selected);
      }

      this.setState({
        [field]: newValues
      });
    }
  }

  renderEvents(filtered) {
    return filtered.map(event => {
      return <Event event={event} />
    })
  }

  render() {

    const { selectedLevels, selectedTags, searchText, events } = this.state
    const skillLevels = EventFilters.getLevels(events);
    const tags = EventFilters.getTags(events);

    const filteredEvents = EventFilters.filter(events, selectedLevels, selectedTags, searchText);

    console.log('FILTERED', filteredEvents);

    return (
      <div className="App">
        <HeroImage />
        <Container>
          <Row>
            <Col sm={12}>
              <div className="App--description">
                <p className="App--description__text">
                  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                  </p>
              </div>
            </Col>
          </Row>
          {this.state.loading ?
            (
              <Row>
                <Col>
                  <p className="App--loading">Ladataan työpajoja...</p>
                </Col>
              </Row>
            ) : (
              <React.Fragment>
                <Row>
                  <Col sm={12}>
                    <Filters
                      title="Valitse kategoriat: "
                      options={tags.sort()}
                      selected={this.state.selectedTags}
                      onChange={this.handleTagsChange}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Filters
                      title="Valitse tasot: "
                      options={skillLevels}
                      selected={this.state.selectedLevels}
                      onChange={this.handleLevelsChange}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <h4>Vapaa haku: </h4>
                    <input
                      className="App--searchbox"
                      value={this.state.searchText}
                      onChange={this.handleSearchChange}
                      placeholder="Hae työpajan nimellä, vetäjällä tai kuvauksella"
                    />
                  </Col>
                  <Col sm={12}>
                    <h4>Näytetään {filteredEvents.length} tapahtumaa</h4>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} md={4}>
                    <EventColumn
                      title="Aamupäivä"
                      times={[EventFilters.TIMES.morning]}
                      events={filteredEvents}
                    />
                  </Col>
                  <Col sm={12} md={4}>
                    <EventColumn
                      title="Iltapäivä"
                      times={[EventFilters.TIMES.afternoon_short, EventFilters.TIMES.afternoon_long]}
                      events={filteredEvents}
                    />
                  </Col>
                  <Col sm={12} md={4}>
                    <EventColumn
                      title="Keynote"
                      times={[EventFilters.TIMES.afternoon_keynote]}
                      events={filteredEvents}
                    />
                  </Col>
                </Row>
              </React.Fragment>
            )}
        </Container>
        <div style={{ height: '100px' }} />
      </div>
    );
  }
}

export default App;
