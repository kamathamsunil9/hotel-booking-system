package com.hotelbooking.booking;

import com.hotelbooking.config.BadRequestException;
import com.hotelbooking.config.ResourceNotFoundException;
import com.hotelbooking.room.Room;
import com.hotelbooking.room.RoomRepository;
import com.hotelbooking.user.User;
import com.hotelbooking.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDto createBooking(BookingRequest request, String userEmail) {
        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        // 1. Validate dates
        if (request.getCheckIn().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book dates in the past");
        }

        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // User lookup
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Check room exists
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        // 3. Check room capacity
        if (request.getGuests() == null || request.getGuests() <= 0) {
            throw new BadRequestException("Guests count must be at least 1");
        }
        if (request.getGuests() > room.getCapacity()) {
            throw new BadRequestException("Guests count exceeds room capacity (" + room.getCapacity() + ")");
        }

        // 4. Check whether the room is already booked for overlapping dates
        boolean isOverlapping = bookingRepository.existsOverlappingBooking(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut()
        );

        if (isOverlapping) {
            throw new BadRequestException("Room is not available for the selected dates");
        }

        // 5. Calculate total price in the backend (Do not trust frontend)
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        double totalPrice = nights * room.getPricePerNight();

        // 6. Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("CONFIRMED");
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        return BookingDto.fromEntity(savedBooking);
    }

    public List<BookingDto> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    public BookingDto getBookingById(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new AccessDeniedException("You do not have permission to perform this action");
        }

        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto cancelBooking(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new AccessDeniedException("You do not have permission to perform this action");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus("CANCELLED");
        Booking updated = bookingRepository.save(booking);
        return BookingDto.fromEntity(updated);
    }

    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto updateBookingStatus(Long id, String newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(newStatus.toUpperCase());
        Booking updated = bookingRepository.save(booking);
        return BookingDto.fromEntity(updated);
    }
}
