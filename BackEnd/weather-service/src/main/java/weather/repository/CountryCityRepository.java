package weather.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import weather.model.CountryCityDetails;

@Repository
public interface CountryCityRepository extends MongoRepository<CountryCityDetails, String> {

	@Query("{ 'countryName': ?0 }")
	List<CountryCityDetails> findByCountryName(String countryName);
}