
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Picker,
  TextInput,
  ImageBackground,
} from 'react-native';

import cityList from './city_list.json'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityId: null,
      city: '',
      cities: cityList,
      weather: null,
    };
  }

  searchCity = (text) => {
    var match = this.state.cities.filter(city =>
      city.name.toLowerCase().includes(text.toLowerCase())
    );
    if (match.length > 0 && this.state.cityId !== match[0].id){
      this.updateState(match[0]);
    }
  }

  updateState = (city) => {
    this.setState({cityId: city.id});
    this.setState({city: city.name});
    this.updateWeather(city.id.toString());
  }

  updateWeather = (cityId) => {
    const KEYAPI = '38d4f8ccd9a93780949c0a0186bd8d45';
    const ENDPOINTAPI = 'http://api.openweathermap.org/data/2.5/weather?id=';
    return fetch(ENDPOINTAPI + cityId + '&appid=' +KEYAPI)
      .then(response => response.json())
      .then(responseJson => {
      if (responseJson.cod !== "400"){
          this.setState({
          weather: responseJson.main,
          });
      }
      })
      .catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerUpper}> Weather App </Text>
          <Text style={styles.headerLower}> Weather Statistic </Text>
        </View>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            label="City"
            onChangeText={text => this.searchCity(text)}
            placeholder="Choose a city"
          />
          <Picker
            style={styles.picker}
            itemStyle={{height: 145}}
            selectedValue={this.state.city}
            onValueChange={(value) => this.searchCity(value)}>
            {this.state.cities.map(city => (
            <Picker.Item label={city.name} value={city.name} />
            ))}
          </Picker>
        </View>
        <View style={styles.widget}>
          { this.state.weather !== null &&
            <ImageBackground source={require('./img/background_image.png')}  style={styles.widgetBackground}>
              <View style={styles.widgetTop}>
                <Text style={styles.widgetTopCity}>{this.state.city}</Text>
                <Text style={styles.widgetTopTemp}>{(this.state.weather.temp - 273.15).toFixed(2)} C</Text>
              </View>
              <View style={styles.widgetBot}>
                <Text style={styles.widgetBotPres}>{Math.round(this.state.weather.pressure)} P</Text>
                <Text style={styles.widgetBotHumi}>{this.state.weather.humidity} %</Text>
              </View>
            </ImageBackground> }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ecf0f1',
    width: "100%",
  },
  header: {
    width: '100%',
    height: 120,
    marginTop: 20,
  },
  headerUpper: {
    paddingTop: 10,
    width: '100%',
    height: 60,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f6f6f6',
    backgroundColor: '#18dcff',
    textAlign: 'center',
  },
  headerLower: {
    paddingTop: 15,
    paddingBottom: 20,
    width: '100%',
    height: 60,
    fontSize: 28,
    color: '#010814',
    textAlign: 'center',
  },
  body: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  input: {
    fontSize: 22,
    textAlign: 'center',
  },
  picker: {
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
  },
  widget: {
    marginBottom: 10,
    width: '100%',
    height: 320,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  widgetBackground: {
    width: 340,
    height: '100%',
    borderRadius: 10,
  },
  widgetTop: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  widgetTopCity: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  widgetTopTemp: {
    color: 'white',
    fontSize: 18,
    marginRight: 10
  },
  widgetBot: {
    marginTop: 182,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignself: 'flex-end'
  },
  widgetBotPres: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  widgetBotHumi: {
    color: 'white',
    fontSize: 18,
    marginRight: 10
  }
});
