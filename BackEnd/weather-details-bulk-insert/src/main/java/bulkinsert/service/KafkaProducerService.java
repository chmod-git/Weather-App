package bulkinsert.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import bulkinsert.model.Weather;


@Service("kafkaProducerService")
public class KafkaProducerService {
	private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

	public KafkaProducerService() {
		log.info("KafkaProduce : Get Instantiaged");
	}

	@Autowired
	private KafkaTemplate<String, Weather> kafkaTemplate;

	@Value("${jsa.kafka.topic}")
	String kafkaTopic = "jsa-test";

	public void sendData(Weather dto) {
		log.info("Publishing started for  :: " + dto);
		kafkaTemplate.send(kafkaTopic, dto);
		log.info("Publishing completed for  :: " + dto);

	}
}
