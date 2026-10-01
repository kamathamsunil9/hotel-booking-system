package com.hotelbooking.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByRoomId(Long roomId);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.status != 'CANCELLED' " +
           "AND b.checkIn < :checkOut " +
           "AND b.checkOut > :checkIn")
    boolean existsOverlappingBooking(@Param("roomId") Long roomId,
                                    @Param("checkIn") LocalDate checkIn,
                                    @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.id != :excludeBookingId " +
           "AND b.status != 'CANCELLED' " +
           "AND b.checkIn < :checkOut " +
           "AND b.checkOut > :checkIn")
    boolean existsOverlappingBookingExcludingId(@Param("roomId") Long roomId,
                                               @Param("excludeBookingId") Long excludeBookingId,
                                               @Param("checkIn") LocalDate checkIn,
                                               @Param("checkOut") LocalDate checkOut);
}
