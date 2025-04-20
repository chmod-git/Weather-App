import React from "react";
import axios from "axios";
import moment from "moment";
import { LineChart } from "react-easy-chart";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";

class Dashboard extends React.Component {
    state = {
        cityData: {},
        loading: true
    };

    cities = ["New York", "London", "Tokyo", "Sydney", "Dubai", "Dublin"];

    componentDidMount() {
        const endDateVal = "2025-03-31";
        const startDateVal = "2025-03-01";

        let requests = this.cities.map(city =>
            axios.get(`http://localhost:8002/forecast/${city}/${startDateVal}/${endDateVal}`)
        );

        Promise.all(requests)
            .then(responses => {
                const cityData = {};
                responses.forEach((res, index) => {
                    const city = this.cities[index];
                    const dataPoints = res.data.map(entry => ({
                        x: moment(entry.date).format("DD-MMM-YY"),
                        y: entry.temperature
                    }));
                    cityData[city] = dataPoints;
                });
                this.setState({ cityData, loading: false });
            })
            .catch(error => {
                console.error("Ошибка при загрузке данных:", error);
                this.setState({ loading: false });
            });
    }

    getYDomain(data) {
        const yValues = data.map(point => point.y);
        const min = Math.min(...yValues);
        const max = Math.max(...yValues);
        return [Math.floor(min - 1), Math.ceil(max + 1)];
    }

    renderCharts() {
        const { cityData } = this.state;

        return (
            <div>
                <section className="container del-body">
                    <div className="row">
                        {Object.entries(cityData).map(([city, data], index) => (
                            <div className="col-md-6 col-sm-12 mb-4" key={index}>
                                <h4 style={{ textAlign: "center" }}>{city}</h4>
                                <div style={{ overflowX: "auto" }}>
                                    <LineChart
                                        axisLabels={{ x: "Date", y: "Temperature" }}
                                        xType="time"
                                        axes
                                        grid
                                        verticalGrid
                                        dataPoints
                                        lineColors={["#" + ((1 << 24) * Math.random() | 0).toString(16)]}
                                        interpolate="cardinal"
                                        width={500}
                                        height={200}
                                        yDomain={this.getYDomain(data)}
                                        data={[data]}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h4>Overall Data</h4>
                        <div style={{ overflowX: "auto" }}>
                            <LineChart
                                axisLabels={{ x: "Date", y: "Temperature" }}
                                xType="time"
                                axes
                                grid
                                verticalGrid
                                dataPoints
                                interpolate="cardinal"
                                lineColors={Object.keys(cityData).map(
                                    () => "#" + ((1 << 24) * Math.random() | 0).toString(16)
                                )}
                                width={1100}
                                height={250}
                                yDomain={this.getYDomain([].concat(...Object.values(cityData)))}
                                data={Object.values(cityData)}
                            />
                        </div>
                    </div>
                </section>

                <div className="boxes">
                    {Object.keys(cityData).map(city => (
                        <div key={city} id={city} className="color-box">
                            {city}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    render() {
        return this.state.loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <LoadingSpinner />
            </div>
        ) : (
            this.renderCharts()
        );
    }
}

export default Dashboard;
