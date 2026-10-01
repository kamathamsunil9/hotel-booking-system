package com.hotelbooking.admin;

import com.hotelbooking.booking.Booking;
import com.hotelbooking.booking.BookingDto;
import com.hotelbooking.booking.BookingRepository;
import com.hotelbooking.booking.BookingService;
import com.hotelbooking.booking.BookingStatusUpdateRequest;
import com.hotelbooking.hotel.Hotel;
import com.hotelbooking.hotel.HotelRepository;
import com.hotelbooking.hotel.HotelRequest;
import com.hotelbooking.hotel.HotelService;
import com.hotelbooking.room.Room;
import com.hotelbooking.room.RoomDto;
import com.hotelbooking.room.RoomRepository;
import com.hotelbooking.room.RoomRequest;
import com.hotelbooking.room.RoomService;
import com.hotelbooking.user.UserDto;
import com.hotelbooking.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final HotelService hotelService;
    private final RoomService roomService;
    private final BookingService bookingService;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public AdminController(HotelService hotelService,
                           RoomService roomService,
                           BookingService bookingService,
                           HotelRepository hotelRepository,
                           RoomRepository roomRepository,
                           UserRepository userRepository,
                           BookingRepository bookingRepository) {
        this.hotelService = hotelService;
        this.roomService = roomService;
        this.bookingService = bookingService;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long totalHotels = hotelRepository.count();
        long totalRooms = roomRepository.count();
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();

        List<Booking> allBookings = bookingRepository.findAll();
        double totalRevenue = allBookings.stream()
                .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        List<BookingDto> recentBookings = bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(5)
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());

        DashboardStatsDto stats = new DashboardStatsDto(
                totalHotels,
                totalRooms,
                totalUsers,
                totalBookings,
                totalRevenue,
                recentBookings
        );

        return ResponseEntity.ok(stats);
    }

    // Hotels management
    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(@Valid @RequestBody HotelRequest request) {
        Hotel created = hotelService.createHotel(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @Valid @RequestBody HotelRequest request) {
        Hotel updated = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Map<String, String>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Rooms management
    @PostMapping("/rooms")
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody RoomRequest request) {
        Room created = roomService.createRoom(request);
        return new ResponseEntity<>(RoomDto.fromEntity(created), HttpStatus.CREATED);
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomDto> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        Room updated = roomService.updateRoom(id, request);
        return ResponseEntity.ok(RoomDto.fromEntity(updated));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Map<String, String>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Bookings management
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingDto> updateBookingStatus(@PathVariable Long id,
                                                         @Valid @RequestBody BookingStatusUpdateRequest request) {
        BookingDto updated = bookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    // Users management
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
