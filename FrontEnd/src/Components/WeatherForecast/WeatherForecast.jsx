import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import WeatherDetailsTable from "../WeatherDetailsTable/weatherDetailsTable";

class WeatherForecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      cityName: "",
      startDate: moment(),
      endDate: moment(),
      weatherDetails: [],
      cityDetails: []
    };
  }

  handleStartDateChange = dateFrom => {
    this.setState({
      startDate: dateFrom
    });
  };

  handleEndDateChange = dateTo => {
    this.setState({
      endDate: dateTo
    });
  };

  handleCityChange = event => {
    this.setState({
      cityName: event.target.value
    });
  };

  componentDidMount() {
    axios({
      method: "GET",
      url: `http://localhost:8001/fetchcity/Ukraine`,
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
  }

  handleSubmit = e => {
    console.log("button clicked");
    e.preventDefault();
    let requestData = {
      cityName: this.state.cityName,
      date: moment(this.state.startDate).format()
    };

    const cityVal = this.state.cityName;
    const startDateVal = moment(this.state.startDate).format('YYYY-MM-DD');
    const endDateVal = moment(this.state.endDate).format('YYYY-MM-DD');

    axios({
      method: "GET",
      url: `http://localhost:8002/forecast/${cityVal}/${startDateVal}/${endDateVal}`,
      headers: {
        "Content-Type": "application/json"
      },
      data: requestData
    })
      .then(response => {
        console.log(response.data);
        this.setState({
          weatherDetails: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <section className="container del-body">
          <form className="weatherdateForm" onSubmit={this.handleSubmit}>
            <div className="center">
              <div className="container tracker-row">
                <div className="col-sm-2 col-desc">City Name</div>
                <div className="col-sm-8 col-desc">
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
                <div className="col-sm-2 col-desc">Start Date</div>
                <div className="col-xs-6 col-sm-6 col-desc">
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleStartDateChange}
                  />
                </div>
              </div>
              <div className="container tracker-row">
                <div className="col-sm-2 col-desc">End Date</div>
                <div className="col-sm-6 col-desc">
                  <DatePicker
                    selected={this.state.endDate}
                    onChange={this.handleEndDateChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 button-style">
                  <button type="submit" className="lg-cta del-btn">
                    Click to get Weather details
                  </button>
                </div>
              </div>
            </div>
            <WeatherDetailsTable weatherDetails={this.state.weatherDetails} />
          </form>
        </section>
      </div>
    );
  }
}

export default WeatherForecast;
