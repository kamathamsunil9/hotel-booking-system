package com.hotelbooking.hotel;

import com.hotelbooking.room.RoomDto;

import java.util.List;

public class HotelDto {
    private Long id;
    private String name;
    private String location;
    private String description;
    private Double rating;
    private String imageUrl;
    private String amenities;
    private Double startingPrice;
    private List<RoomDto> rooms;

    public HotelDto() {
    }

    public HotelDto(Long id, String name, String location, String description, Double rating, String imageUrl, String amenities, Double startingPrice, List<RoomDto> rooms) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.amenities = amenities;
        this.startingPrice = startingPrice;
        this.rooms = rooms;
    }

    public static HotelDto fromEntity(Hotel hotel, Double startingPrice, List<RoomDto> rooms) {
        if (hotel == null) return null;
        return new HotelDto(
                hotel.getId(),
                hotel.getName(),
                hotel.getLocation(),
                hotel.getDescription(),
                hotel.getRating(),
                hotel.getImageUrl(),
                hotel.getAmenities(),
                startingPrice,
                rooms
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public Double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(Double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public List<RoomDto> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomDto> rooms) {
        this.rooms = rooms;
    }
}
