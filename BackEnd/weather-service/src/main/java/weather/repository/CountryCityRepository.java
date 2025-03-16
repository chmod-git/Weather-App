package weather.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import weather.model.CountryCityDetails;

@Repository
public interface CountryCityRepository extends MongoRepository<CountryCityDetails, String>{

	Iterable<CountryCityDetails> findByCountryName(String countryName);
}
