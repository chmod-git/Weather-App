package bulkinsert.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import bulkinsert.model.Weather;

@Repository
public interface WeatherBulkInsertRepository extends MongoRepository<Weather, String>{

}
