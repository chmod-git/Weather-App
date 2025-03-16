package weather.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import weather.exception.InternalServerException;
import weather.model.Weather;
import weather.service.WeatherService;

@RestController
@RequestMapping("/weather")
@CrossOrigin("*")
public class WeatherController {
	
	private static final Logger log = LoggerFactory.getLogger(WeatherController.class);
	
	@Autowired
	WeatherService weatherService;
	
	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public Iterable<Weather> getAllWeatherDetails() {
		
		log.info("--- Inside getAllWeatherDetails method of " + this.getClass().getSimpleName()
				+ " ---");
		try {
			return weatherService.getAllWeatherDetails();
		} catch (InternalServerException e) {
			log.error(" --- Exception occured in getAllWeatherDetails method of " +
					this.getClass().getSimpleName() + " ---");
			throw new InternalServerException(e.getMessage());
		}
	}
		
		@GetMapping(value = "citydate/{city}/{date}", produces = MediaType.APPLICATION_JSON_VALUE)
		public Iterable<Weather> getWeatherByCityAndDate(@PathVariable String city, @PathVariable String date) {
			log.info("--- Inside getWeatherByCityAndDate method of " + this.getClass().getSimpleName() 
					+ " ---");
			try {
				Iterable<Weather> weather = weatherService.getWeatherByCityAndDate(city, date);
				return weather;
			} catch (InternalServerException e) {
				log.error(" --- Exception occured in getWeatherByCityAndDate method of " +
						this.getClass().getSimpleName() + " ---");
				throw new InternalServerException(e.getMessage());
			}
		}
}
