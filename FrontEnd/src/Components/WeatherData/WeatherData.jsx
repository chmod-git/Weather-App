import React from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class WeatherData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      cityName: "",
      countryName: "",
      temperature: "",
      cloudsDescription: "",
      windDescription: "",
      weatherDescription: "",
      pressure: "",
      humidityPercentage: "",
      date: moment(),
      cityDetails: []
    };
  }

  handleDateChange = date => {
    this.setState({
      date: date
    });
  };

  handleCityChange = event => {
    this.setState({
      cityName: event.target.value
    });
  };

  handleCountryChange = event => {
    this.setState({
      countryName: event.target.value
    });
    const c = event.target.value;
    axios({
      method: "GET",
      url: `http://localhost:8001/fetchcity/${c}`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        this.setState({
          cityDetails: response.data
        });
        console.log(this.state.cityDetails);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleTemperatureChange = event => {
    this.setState({
      temperature: event.target.value
    });
  };

  handleCloudDesc = event => {
    this.setState({
      cloudsDescription: event.target.value
    });
  };

  handleWindDesc = event => {
    this.setState({
      windDescription: event.target.value
    });
  };

  handleWeatherDesc = event => {
    this.setState({
      weatherDescription: event.target.value
    });
  };

  handlePressureChange = event => {
    this.setState({
      pressure: event.target.value
    });
  };

  handleHumidityChange = event => {
    this.setState({
      humidityPercentage: event.target.value
    });
  };

  handleSubmitWeatherData = e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const insertRequestData = {
      cityName: this.state.cityName,
      countryName: this.state.countryName,
      temperature: this.state.temperature,
      cloudsDescription: this.state.cloudsDescription,
      weatherDescription: this.state.weatherDescription,
      windDescription: this.state.windDescription,
      pressure: this.state.pressure,
      humidityPercentage: this.state.humidityPercentage,
      date: moment(this.state.date).format()
    };
    insertRequestData.date = insertRequestData.date.substring(0, 10);
    axios({
      method: "POST",
      url: `http://localhost:8003/insert`,
      headers: {
        "Content-Type": "application/json"
      },
      data: insertRequestData
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
    this.setState({
      cityName: "",
      countryName: "",
      temperature: "",
      cloudsDescription: "",
      windDescription: "",
      weatherDescription: "",
      pressure: "",
      humidityPercentage: "",
      date: moment()
    });
  };

  render() {
    return (
      <div className="row">
        <section className="container del-body">
          <form
            className="weatherdateForm"
            onSubmit={this.handleSubmitWeatherData}
          >
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">Country Name</div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <div className="select">
                  <select
                    value={this.state.countryName}
                    required={true}
                    onChange={this.handleCountryChange}
                  >
                    <option value="">Select any Country..</option>
                    <option value="US">US</option>
                    <option value="Ireland">Ireland</option>
                    <option value="UK">UK</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Australia">Australia</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">City Name</div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <div className="select">
                  <select
                    value={this.state.cityName}
                    required={true}
                    onChange={this.handleCityChange}
                  >
                    <option value="">Select any city..</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Dublin">Dublin</option>
                    <option value="Amsterdam">Amsterdam</option>
                    {this.state.cityDetails.map((city, index) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">
                Temperature ( &#8451;)
              </div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <input
                  type="text"
                  value={this.state.temperature}
                  placeholder="Enter Temperature in &#8451;"
                  required={true}
                  onChange={this.handleTemperatureChange}
                />
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">
                Cloud Description
              </div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <input
                  type="text"
                  value={this.state.cloudsDescription}
                  placeholder="Enter Cloud Description"
                  required={true}
                  onChange={this.handleCloudDesc}
                />
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">Wind Description</div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <input
                  type="text"
                  value={this.state.windDescription}
                  placeholder="Enter Wind Description"
                  required={true}
                  onChange={this.handleWindDesc}
                />
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">
                Weather Description
              </div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <input
                  type="text"
                  value={this.state.weatherDescription}
                  placeholder="Enter Weather Description"
                  required={true}
                  onChange={this.handleWeatherDesc}
                />
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">Pressure (hPa)</div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <input
                  type="text"
                  value={this.state.pressure}
                  placeholder="Enter Pressure in hPa"
                  required={true}
                  onChange={this.handlePressureChange}
                />
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">
                Humidity Percentage (%)
              </div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <input
                  type="text"
                  value={this.state.humidityPercentage}
                  placeholder="Enter Humidity %"
                  required={true}
                  onChange={this.handleHumidityChange}
                />
              </div>
            </div>
            <div className="container tracker-row">
              <div className="col-xs-6 col-sm-4 col-desc">Date</div>
              <div className="col-xs-6 col-sm-8 col-desc">
                <DatePicker
                  selected={this.state.date}
                  required
                  onChange={this.handleDateChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <button type="submit" className="lg-cta del-btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default WeatherData;
