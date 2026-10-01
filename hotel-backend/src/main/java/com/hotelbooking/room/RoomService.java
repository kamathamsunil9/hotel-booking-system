package com.hotelbooking.room;

import com.hotelbooking.booking.BookingRepository;
import com.hotelbooking.config.BadRequestException;
import com.hotelbooking.config.ResourceNotFoundException;
import com.hotelbooking.hotel.Hotel;
import com.hotelbooking.hotel.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;

    public RoomService(RoomRepository roomRepository,
                       HotelRepository hotelRepository,
                       BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<RoomDto> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelIdOrderByPricePerNightAsc(hotelId)
                .stream()
                .map(RoomDto::fromEntity)
                .collect(Collectors.toList());
    }

    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return RoomDto.fromEntity(room);
    }

    public AvailabilityResponse checkAvailability(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book dates in the past");
        }

        if (!checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        boolean isOverlapping = bookingRepository.existsOverlappingBooking(roomId, checkIn, checkOut);
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        double totalPrice = nights * room.getPricePerNight();

        if (isOverlapping) {
            return new AvailabilityResponse(
                    false,
                    room.getId(),
                    room.getRoomNumber(),
                    room.getRoomType(),
                    checkIn,
                    checkOut,
                    nights,
                    room.getPricePerNight(),
                    totalPrice,
                    "Room is not available for the selected dates"
            );
        }

        return new AvailabilityResponse(
                true,
                room.getId(),
                room.getRoomNumber(),
                room.getRoomType(),
                checkIn,
                checkOut,
                nights,
                room.getPricePerNight(),
                totalPrice,
                "Room is available for booking"
        );
    }

    @Transactional
    public Room createRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());

        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));

        room.setHotel(hotel);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());

        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }
}
