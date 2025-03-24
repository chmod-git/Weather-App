package weather.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import weather.model.CountryCityDetails;
import weather.repository.CountryCityRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/fetchcity")
@CrossOrigin("*")
public class DashboardController {

	private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

	@Autowired
	private CountryCityRepository countryCityRepository;

	@GetMapping(value = "/{countryName}", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<String> getCityNamesForACountryName(@PathVariable String countryName) {

		log.info("--- Searching for cities in country: " + countryName + " ---");

		List<CountryCityDetails> cities = countryCityRepository.findByCountryName(countryName);

		log.info("Query result: " + cities);

		return cities.stream()
				.map(CountryCityDetails::getCityName)
				.collect(Collectors.toList());
	}
}