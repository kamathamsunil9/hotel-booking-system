package com.hotelbooking.hotel;

import com.hotelbooking.config.ResourceNotFoundException;
import com.hotelbooking.room.Room;
import com.hotelbooking.room.RoomDto;
import com.hotelbooking.room.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public HotelService(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    public List<HotelDto> getAllHotels(String location) {
        List<Hotel> hotels;
        if (location != null && !location.trim().isEmpty()) {
            hotels = hotelRepository.findByLocationContainingIgnoreCase(location.trim());
        } else {
            hotels = hotelRepository.findAll();
        }

        return hotels.stream().map(hotel -> {
            List<Room> rooms = roomRepository.findByHotelIdOrderByPricePerNightAsc(hotel.getId());
            Double minPrice = rooms.isEmpty() ? 0.0 : rooms.get(0).getPricePerNight();
            return HotelDto.fromEntity(hotel, minPrice, null);
        }).collect(Collectors.toList());
    }

    public HotelDto getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        List<Room> rooms = roomRepository.findByHotelIdOrderByPricePerNightAsc(id);
        Double minPrice = rooms.isEmpty() ? 0.0 : rooms.get(0).getPricePerNight();
        List<RoomDto> roomDtos = rooms.stream().map(RoomDto::fromEntity).collect(Collectors.toList());

        return HotelDto.fromEntity(hotel, minPrice, roomDtos);
    }

    @Transactional
    public Hotel createHotel(HotelRequest request) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setRating(request.getRating());
        hotel.setImageUrl(request.getImageUrl());
        hotel.setAmenities(request.getAmenities());
        return hotelRepository.save(hotel);
    }

    @Transactional
    public Hotel updateHotel(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setRating(request.getRating());
        hotel.setImageUrl(request.getImageUrl());
        hotel.setAmenities(request.getAmenities());
        return hotelRepository.save(hotel);
    }

    @Transactional
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    public List<String> getDistinctLocations() {
        return hotelRepository.findDistinctLocations();
    }
}
