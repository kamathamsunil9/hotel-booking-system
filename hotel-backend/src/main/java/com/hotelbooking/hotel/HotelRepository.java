package com.hotelbooking.hotel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocationContainingIgnoreCase(String location);

    boolean existsByName(String name);

    @Query("SELECT DISTINCT h.location FROM Hotel h ORDER BY h.location ASC")
    List<String> findDistinctLocations();
}
