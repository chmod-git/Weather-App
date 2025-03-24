package bulkinsert.controller;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.io.*;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import bulkinsert.exception.InternalServerException;
import bulkinsert.model.Weather;
import bulkinsert.service.FileUploadService;
import bulkinsert.service.KafkaProducerService;
import bulkinsert.service.WeatherDetailsBulkInsertService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/bulkInsert")
@CrossOrigin("*")
public class WeatherDetailsBulkInsertController {

	private static final Logger log = LoggerFactory.getLogger(WeatherDetailsBulkInsertController.class);
	private final ExecutorService executor = Executors.newFixedThreadPool(5);

	@Autowired
	KafkaProducerService kafkaProduceService;

	@Autowired
	WeatherDetailsBulkInsertService bulkInsertService;

	@Autowired
	private FileUploadService fileUploadService;

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public Iterable<Weather> insertMultipleDetails(@RequestBody Iterable<Weather> weather) {
		log.info("--- Inside insertMultipleDetails method ---");
		try {
			return bulkInsertService.insertMultipleDetails(weather);
		} catch (InternalServerException e) {
			log.error("Exception in insertMultipleDetails: {}", e.getMessage());
			throw new InternalServerException(e.getMessage());
		}
	}

	@PostMapping("/fileUpload")
	public ResponseEntity<String> fileUpload(@RequestParam("file") MultipartFile file) {
		log.info("--- Inside fileUpload method ---");
		ObjectMapper mapper = new ObjectMapper();

		if (file.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty!");
		}

		try (InputStreamReader reader = new InputStreamReader(file.getInputStream())) {
			List<Weather> weatherDtos = mapper.readValue(reader,
					mapper.getTypeFactory().constructCollectionType(List.class, Weather.class));

			if (!weatherDtos.isEmpty()) {
				for (Weather dto : weatherDtos) {
					executor.submit(() -> kafkaProduceService.sendData(dto));
				}
			}
			return ResponseEntity.ok("File uploaded and data sent to Kafka successfully");
		} catch (IOException e) {
			log.error("Error processing file: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File processing failed");
		}
	}

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile uploadfile) {
		log.info("Received file: {}", uploadfile.getOriginalFilename());

		if (uploadfile.isEmpty()) {
			log.error("File is empty!");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please select a file!");
		}

		try {
			String fileName = fileUploadService.storeFile(uploadfile);
			log.info("Stored file at: {}", fileName);

			processFile(fileName);

			return ResponseEntity.ok("Successfully uploaded - " + uploadfile.getOriginalFilename());
		} catch (IOException e) {
			log.error("File upload error: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
		}
	}

	private void processFile(String fileName) throws IOException {
		log.info("Processing file: {}", fileName);

		File file = new File(fileName);
		if (!file.exists()) {
			log.error("File not found: {}", fileName);
			throw new IOException("File not found: " + fileName);
		}

		ObjectMapper mapper = new ObjectMapper();
		try (InputStreamReader reader = new InputStreamReader(new FileInputStream(file))) {
			List<Weather> objs = mapper.readValue(reader,
					mapper.getTypeFactory().constructCollectionType(List.class, Weather.class));
			log.info("Parsed {} weather records", objs.size());
			bulkInsertService.insertMultipleDetails(objs);
		}
	}
}
