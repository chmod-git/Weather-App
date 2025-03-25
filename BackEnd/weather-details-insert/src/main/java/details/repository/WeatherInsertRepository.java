package details.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import details.model.Weather;

@Repository
public interface WeatherInsertRepository extends MongoRepository<Weather, String>{

}
