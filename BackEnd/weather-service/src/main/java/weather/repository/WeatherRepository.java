package weather.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import weather.model.Weather;

@Repository
public interface WeatherRepository extends MongoRepository<Weather, String> {

	List<Weather> findByCityNameAndDateBetween(String cityName, LocalDateTime start, LocalDateTime end);
}
