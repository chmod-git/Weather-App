package bulkinsert.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bulkinsert.exception.InternalServerException;
import bulkinsert.model.Weather;
import bulkinsert.repository.WeatherBulkInsertRepository;

@Service
public class WeatherDetailsBulkInsertService {

	private static final Logger log = LoggerFactory.getLogger(WeatherDetailsBulkInsertService.class);

	@Autowired
	KafkaProducerService kafkaProducerService;

	@Autowired
	WeatherBulkInsertRepository bulkInsertRepository;

	public Iterable<Weather> insertMultipleDetails(Iterable<Weather> weather) {

		log.info("--- Inside insertMultipleDetails method of " + this.getClass().getSimpleName() + " ---");
		try {
			for (Weather w : weather) {
				kafkaProducerService.sendData(w);
			}
		} catch (Exception e) {
			log.error(" --- Exception occured in insertMultipleDetails method of " + this.getClass().getSimpleName()
					+ " ---");
			throw new InternalServerException(e.getMessage());
		}
		return weather;
	}

}
