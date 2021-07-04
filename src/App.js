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
import Favorites from './services/favorites';
import FavoritesList from './components/FavoritesList';

import TEST_EVENTS from './Events.json';

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
      favorites: [],
      showList: true,
    }

    this.handleLevelsChange = this.handleSelectChange('selectedLevels').bind(this);
    this.handleTagsChange = this.handleSelectChange('selectedTags').bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.isFavorite = this.isFavorite.bind(this);
  }

  componentDidMount() {
    // TEST DATA USAGE 
    // TEST_EVENTS.forEach(event => {
    //   event = event.time = `${event.start_time}-${event.end_time}`;
    // })
    // console.log(TEST_EVENTS);
    // this.setState({
    //   events: _.sortBy(TEST_EVENTS, 'name'),
    //   loading: false,
    // });

    // ACTUAL DATA
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
    });

    this.setState({
      favorites: Favorites.getFavorites()
    });
  }

  handleToggleFavorite(event) {
    const newFavorites = Favorites.toggleFavorite(event);
    this.setState({
      favorites: newFavorites
    })
  }

  isFavorite(event) {
    const { favorites } = this.state;
    return favorites.indexOf(Favorites.getKey(event)) !== -1;
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

  renderEventList() {
    const { selectedLevels, selectedTags, searchText, events, favorites } = this.state
    const skillLevels = EventFilters.getLevels(events);
    const tags = EventFilters.getTags(events);
    const filteredEvents = EventFilters.filter(events, selectedLevels, selectedTags, searchText);

    return (
      <React.Fragment>
        <Row>
          <Col sm={12}>
            <Filters
              title="Valitse kategoria(t): "
              options={tags.sort()}
              selected={this.state.selectedTags}
              onChange={this.handleTagsChange}
            />
          </Col>
          <Col sm={12} md={6}>
            {/* Levels / taitotasot tulee taustasta */}
            <Filters
              title="Valitse taitotaso(t): "
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
              onToggleFavorite={this.handleToggleFavorite}
              isFavorite={this.isFavorite}
              title="Lauantai Aamupäivä"
              times={[
                EventFilters.TIMES.morning1,
                EventFilters.TIMES.morning2,
                EventFilters.TIMES.morning3,
              ]}
              events={filteredEvents}
              id='morning'
            />
          </Col>
          <Col sm={12} md={4}>
            <EventColumn
              onToggleFavorite={this.handleToggleFavorite}
              isFavorite={this.isFavorite}
              title="Lauantai Iltapäivä"
              times={[
                EventFilters.TIMES.afternoon1,
                EventFilters.TIMES.afternoon2,
                EventFilters.TIMES.afternoon3,
                EventFilters.TIMES.afternoon4
              ]}
              events={filteredEvents}
              id='afternoon'
            />
          </Col>
          <Col sm={12} md={4}>
            <EventColumn
              onToggleFavorite={this.handleToggleFavorite}
              isFavorite={this.isFavorite}
              title="Sunnuntai Vertaisverstas"
              times={[EventFilters.TIMES.sunday]}
              events={filteredEvents}
              id='sunday'
            />
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  renderFavoritesList(favoritedEvents) {
    return (
      <Row>
        <Col sm={12}>
          <FavoritesList favoritedEvents={favoritedEvents} onToggleFavorite={this.handleToggleFavorite} />
        </Col>
      </Row>
    )
  }

  renderLoading() {
    return (
      <Row>
        <Col sm={12}>
          <p className="App--loading">Ladataan työpajoja...</p>
        </Col>
      </Row>
    )
  }

  render() {
    const { showList, favorites, events } = this.state;
    const favoritedEvents = _.reduce(favorites, (sum, key) => {
			const event = _.find(events, e => Favorites.getKey(e) === key);
			if (event) {
				return sum.concat(event);
			}
			return sum;
    }, []);
    
    return (
      <div className="App">
        <HeroImage />
        <Container>
          <Row>
            <Col sm={12}>
              <div className="App--description">
                <p className="App--description__title">Tervetuloa tutustumaan Johtajatulien 2021 valinnaiseen ohjelmaan! </p>

                <p className="App--description__text"></p>
                  
                  {/* <p>
                  Työpajailmoittautuminen aukeaa 13.8. klo 18:00, ja sulkeutuu 23.8. klo 23:59. Henkilökohtainen ilmoittautumislinkki on lähetetty sinulle sähköpostissa, jonka annoit ilmoittautuessasi. (Partiolainen, se on sama, joka on merkitty kuksaan) Ongelmatapauksissa ota yhteys johtajatulet@partio.fi
                  </p>
                  <p>
                  1. Valitse lauantaiksi 5 mieluisinta työpajaa - yksi aamu- ja yksi iltapäivälle. Iltapäivän työpajat ovat eri pituisia. Mikäli valitset lyhyemmän työpajan (klo 14:15 - 15:45), voit halutessasi mennä kuuntelemaan vielä klo 16:00 - 16:45 järjestettävää puheenvuoroa. Uudessa lomakkeessa <strong>valitaan 5–10</strong> työpajavaihtoehtoa <strong>itselle mieluisimmassa</strong> järjestyksessä. Kiinnostavin ensin! Tiedon työpajoista, joihin pääsit, saat seuraavan vuorokauden sisällä.
                  </p> */}
                  
                  <p>
                  Johtajatulille on tulossa noin 300 etukäteen valittavaa työpajaa, puheenvuoroa ja vertaisverstasta. Haluamme auttaa sinua löytämään itsellesi niistä sopivimmat. Voit selailla valikoimaa tällä sivustolla. 
                  </p>

                  <p>
                  Lauantain työpajat ovat osallistavia, ja ne toteutetaan noin 30 henkilön ryhmissä. Puheenvuorot esitetään lavoilla, ja niitä kuuntelemaan pääsee isompi joukko ihmisiä. Pääpuheenvuorot ovat tarjolla kaikille osallistujille, eikä niihin tarvitse erikseen ilmoittautua.  
                  </p>
                  <p>
                  Vertaisverstaat toteutetaan sunnuntaina. Niissä verstaiden vetäjiksi ilmoittautuneet osallistujat jakavat omia taitojaan ja kiinnostuksen kohteitaan toisille osallistujille. Verstaiden aiheet ovat vapaamuotoisempia ja sisältävät kaikkea venyttelystä tulen teon opetteluun.  
                  </p>
                  <p>
                  Itse ilmoittautuminen valinnaisiin ohjelmiin alkaa <strong>tiistaina 3.8.2021 ja päättyy to 12.8.2021. </strong>
                  </p>
                  <p>
                  HUOM! Ilmoittautumisessa ei tarvitse olla nopein, vaan sinulla on rauhassa aikaa valita sekä ilmoittautua pajoihin. 
                  </p>
                  <ol>
                    <li>Selaile teemoja, pajoja ja verstaita sivustolla. Merkitse talteen kiinnostavimpien ohjelmien numero ja nimi. <br></br> </li>
                    <li>Lopullinen valinta tehdään ilmoittautumisjärjestelmä Kuksassa. Työpajoihin, puheenvuoroihin ja vertaisverstaisiin ilmoittaudutaan siellä tapahtumailmoittautumisen tapaan. Saat ilmoittamaasi sähköpostiosoitteeseen linkin Kuksaan ja ohjeet lähempänä ilmoittautumisen alkua. <br></br></li>

                    <li>Kuksassa työpajoihin ilmoittautuessasi valitset itseäsi eniten kiinnostavat teemat. Tämän lisäksi voit valita 10 työpajaa ja vertaisverstasta. Osallistujat jaetaan lauantain työpajoihin ja sunnuntain vertaisverstaisiin ilmoittautumisten perusteella. <br></br></li>
                   
                    <li>Saat sähköpostiisi tiedon sinulle valituista työpajoista sekä vertaisverstaasta viimeistään maanantaina 23.8. <br></br></li>
                  </ol>
                  
                   

                  
                   
                  
                  
                  <p className="App--description__title">  Näin selailet ohjelmaa </p>
                  <div className="App--description__levels">
                    <p>Olemme luoneet sivustolle suodattimia, jotta selaaminen olisi helpompaa. Voit valita kategoriat, jolloin työkalu rajoittaa näkymän vain osumiin, jotka sisältävät valitut tägit.</p>
                  <p>
                  <strong>Valittavat kategoriat </strong> 
                  </p>
                  <ul>
                    <li> Kategorioina kaikessa ohjelmassa johtajatulien teemat: empatia, hyvinvointi, kestävyys.</li>
                    <li>Työpajoissa (T): Valitse johtamisen osa-alueet, joihin haluat keskittyä. Olemme luokitelleet työpajat Maailman partiotyttöjärjestön (WAGGGS) <a href="https://www.partio.fi/lippukunnille/pestien-tuki/johtaminen-partiossa/">johtamismallin</a> mukaan. </li>
                    <li>Vertaisverstaissa (V): Valitse haluamasi aihepiirit. Vertaisverstaat päivittyvät vielä ennen ilmoittautumisen alkua.</li>
                    <li>Vaeltajat (18 - 22-vuotiaat) huomio! Teille on valittu joukko juuri Vaeltaja-ohjelmaan sopivia työpajoja ja ne löytyvät helposti valitsemalla kategoriaksi: ”T: Suosittelemme Vaeltajille”. </li>
                    <li>Puheenvuorot löytyvät numeroilla 1-15 </li>
                  </ul>
                  <p>
                 
                  </p>
                  <p>
                  
                  </p>
                  <p>
                  
                  </p>
                  <p>
                  
                  </p>
                  <p>
                  
                  </p>


                  
                  <p>
                  <strong>Valittavat taitotasot </strong>
                  </p>
                  <p>
                  Perustaso (keltainen reunus): Työpajoissa harjoitellaan uusia taitoja ja tutustutaan uusiin aiheisiin ja näkökulmiin tarvitsematta aiempaa tietoa tai kokemusta. 
                  </p>
                  <p>
                  Syventävä (oranssi reunus): Työpajoissa sukelletaan syvemmälle rajattuun aiheeseen. Valitse tämä, jos haluat vähemmästä enemmän. Joissakin työpajoissa omat kokemukset tai aiempi tietämys aiheesta ovat toivottavia keskusteluun osallistumiseksi. 
                  </p>
                  </div>

                  <p>
                  <strong>Vapaa haku </strong>
                  </p>
                  <p>
                  Vapaa haku toimii työpajan nimellä, vetäjällä tai kuvauksessa olevalla sanalla. Tätä varten olemme lisänneet avainsanoja kuvauksiin. 
                  </p>

                  <p>
                  <strong>Suosikkien merkitseminen </strong> 
                  </p>
                  <p>
                  Voit merkitä jokaisen ohjelmakortin alareunasta työpajan/puheenvuoron/vertaisverstaan omiin suosikkeihisi. Löydät suosikkilistan valitsemalla tämän tekstin alta ”Omat suosikit”. Suosikkilista tallentuu selaimen välimuistiin, joten sen tyhjentäminen tyhjentää myös listan. 
                  </p>
                  
                  <p><i>Koska osallistujia on yli 3000 henkilöä emme valitettavasti voi taata, että jokainen pääsee haluamaansa pajaan/verstaaseen. Pyrimme kuitenkin siihen, että jokaiselle löytyy tapahtumasta mielekästä ohjelmaa.</i> </p>
              





                  
                  {/* <p className="App--description__text"></p>
                  <p>
                  2. Valitse tasosi: tutustu, perehdy tai syvenny.
                  </p>
                  <div className="App--description__levels">
                  <p>
                  <strong>Tutustu (keltainen):</strong><br/> Työpajoissa harjoitellaan uusia taitoja ja tutustutaan uusiin aiheisiin ja näkökulmiin tarvitsematta aiempaa tietoa tai kokemusta. 
                  </p>
                  <p>
                  <strong>Perehdy (oranssi):</strong><br/> Asiaa johtamisesta ja johtajuudesta laajasti eri näkökulmista.
                  </p>
                  <p>
                  <strong>Syvenny (punainen):</strong><br/> Työpajoissa sukelletaan syvemmälle rajattuun aiheeseen. Valitse tämä, jos haluat vähemmästä enemmän. Joissakin työpajoissa omat kokemukset tai aiempi tietämys aiheesta ovat toivottavia keskusteluun osallistumiseksi.
                  </p>
                  <p>
                  3. Valitse johtamisen osa-alueet, joihin haluat keskittyä. Olemme luokitelleet työpajat partion johtamismallin mukaan itsensä johtamistaitoihin (minä), vuorovaikutustaitoihin (ryhmä), organisointitaitoihin (toiminta) ja visiointitaitoihin (päämäärä).
                  </p>
                  <p>
                  Minä
                  </p>
                  <ul>
                    <li>Hyvinvointi ja elämänhallinta</li>
                    <li>Suhde itseen</li>
                    <li>Menestyminen työelämässä</li>
                  </ul>
                  <p>
                  Ryhmä
                  </p>
                  <ul>
                    <li>Ihmisten johtaminen</li>
                    <li>Ihmisten kohtaaminen</li>
                    <li>Vuorovaikutus- ja yhteistyötaidot</li>
                  </ul>
                  <p>
                  Toiminta
                  </p>
                  <ul>
                    <li>Kehittäminen ja muutos</li>
                    <li>Työelämätaidot</li>
                    <li>Toiminnan työkaluja</li>
                  </ul>
                  <p>
                  Päämäärä
                  </p>
                  <ul>
                    <li>Halu toimia</li>
                    <li>Vastuullisuus</li>
                  </ul>
                  <p>
                  Vaeltajat (18 - 21-vuotiaat) huomio! Teille on valittu joukko juuri Vaeltaja-ohjelmaan sopivia työpajoja ja ne löytyvät helposti valitsemalla kategoriaksi: ”Suosittelemme Vaeltajille”. 
                  </p>
                  <p>
                  Työpajoja on tällä hetkellä yli 150, joten selaile rauhassa. Työpajoihin ilmoittaudutaan elokuussa. Ohjeet ilmoittautumisesta lähetetään tapahtumaan ilmoittautuneille sähköpostilla.
                  </p> */}
                
              {/* </div> */}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div className="App--toggle-view">
                <div onClick={() => this.setState({ showList: true })} className={`App--toggle-view__option ${showList ? 'active' : ''}`}>
                  <span className="App--toggle-view__option-text">Selaa työpajoja</span>
                </div>
                <div onClick={() => this.setState({ showList: false })} className={`App--toggle-view__option ${showList ? '' : 'active'}`}>
                  <span className="App--toggle-view__option-text">Omat suosikit ({favoritedEvents.length})</span>
                </div>
              </div>
            </Col>
          </Row>
          {this.state.loading ?
            (
              this.renderLoading()
            ) : (
              showList ? this.renderEventList() : this.renderFavoritesList(favoritedEvents)
            )}
        </Container>
        <div style={{ height: '100px' }} />
      </div>
    );
  }
}

export default App;
