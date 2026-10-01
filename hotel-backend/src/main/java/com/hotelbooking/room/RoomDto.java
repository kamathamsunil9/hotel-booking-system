package com.hotelbooking.room;

public class RoomDto {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String roomNumber;
    private String roomType;
    private Double pricePerNight;
    private Integer capacity;
    private String description;

    public RoomDto() {
    }

    public RoomDto(Long id, Long hotelId, String hotelName, String roomNumber, String roomType, Double pricePerNight, Integer capacity, String description) {
        this.id = id;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.capacity = capacity;
        this.description = description;
    }

    public static RoomDto fromEntity(Room room) {
        if (room == null) return null;
        return new RoomDto(
                room.getId(),
                room.getHotel() != null ? room.getHotel().getId() : null,
                room.getHotel() != null ? room.getHotel().getName() : null,
                room.getRoomNumber(),
                room.getRoomType(),
                room.getPricePerNight(),
                room.getCapacity(),
                room.getDescription()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
