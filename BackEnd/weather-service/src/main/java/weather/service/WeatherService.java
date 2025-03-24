package weather.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import weather.exception.InternalServerException;
import weather.model.Weather;
import weather.repository.WeatherRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class WeatherService {
	
	private static final Logger log = LoggerFactory.getLogger(WeatherService.class);
	
	@Autowired
	WeatherRepository weatherRepository;
	
	public Iterable<Weather> getAllWeatherDetails() {
		
		log.info("--- Inside getAllWeatherDetails method of " + this.getClass().getSimpleName() +" ---");
		try {
			return weatherRepository.findAll();
		} catch (Exception e) {
			log.error("-- Exception occured in getAllWeatherDetails method of " + this.getClass().getSimpleName()
					 + " --");
			throw new InternalServerException(e.getMessage());
		}
	}
	
	public Iterable<Weather> getWeatherByCityAndDate(String cityName, String date) {
		
		log.info("--- Inside getWeatherByCityAndDate method of " + this.getClass().getSimpleName() + " ---");
		try {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate localDate = LocalDate.parse(date, formatter);

			LocalDateTime startOfDay = localDate.atStartOfDay();
			LocalDateTime endOfDay = localDate.atTime(23, 59, 59);

			List<Weather> weatherList = weatherRepository.findByCityNameAndDateBetween(cityName, startOfDay, endOfDay);

			log.info("Weather data found: " + weatherList);
			return weatherList;
		} catch (Exception e) {
			log.error(" --- Exception in getWeatherByCityAndDate ---", e);
			throw new InternalServerException(e.getMessage());
		}
	}
}
