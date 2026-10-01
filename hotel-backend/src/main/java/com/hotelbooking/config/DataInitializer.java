package com.hotelbooking.config;

import com.hotelbooking.booking.Booking;
import com.hotelbooking.booking.BookingRepository;
import com.hotelbooking.hotel.Hotel;
import com.hotelbooking.hotel.HotelRepository;
import com.hotelbooking.room.Room;
import com.hotelbooking.room.RoomRepository;
import com.hotelbooking.user.User;
import com.hotelbooking.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           HotelRepository hotelRepository,
                           RoomRepository roomRepository,
                           BookingRepository bookingRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedHotelsAndRooms();
        seedSampleBookings();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@hotel.com")) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@hotel.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("user@hotel.com")) {
            User user = new User();
            user.setName("John Doe");
            user.setEmail("user@hotel.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole("USER");
            userRepository.save(user);
        }
    }

    private void seedHotelsAndRooms() {
        // ================= BANGALORE (3 Hotels) =================
        createHotelWithRooms(
                "Grand Palace Hotel",
                "Bangalore",
                "A luxurious 5-star hotel in the heart of Bangalore offering opulent suites, world-class dining, lush gardens, and tranquil spa amenities.",
                4.8,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2000.0, 3000.0, 4500.0, 7000.0
        );

        createHotelWithRooms(
                "Silicon Valley Grand Hotel",
                "Bangalore",
                "Upscale 5-star hotel in Whitefield, tech hub of Bangalore, featuring a rooftop infinity pool, tech lounge, and Italian bistro.",
                4.7,
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2200.0, 3400.0, 4900.0, 7800.0
        );

        createHotelWithRooms(
                "Garden City Luxury Suites",
                "Bangalore",
                "Quiet botanical retreat near Cubbon Park offering private terrace gardens, peaceful suites, and artisanal cafe dining.",
                4.6,
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                1900.0, 2900.0, 4400.0, 6800.0
        );

        // ================= GOA (3 Hotels) =================
        createHotelWithRooms(
                "Ocean Pearl Resort",
                "Goa",
                "Beachfront paradise in North Goa with stunning Arabian Sea views, direct beach access, infinity pool, and coastal seafood dining.",
                4.7,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Room Service, Air Conditioning",
                2500.0, 3800.0, 5500.0, 8500.0
        );

        createHotelWithRooms(
                "Sunset Bay Beach Resort",
                "Goa",
                "Calangute beach resort featuring private beach shacks, a sunset cocktail bar, and water sports concierge.",
                4.8,
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Room Service, Air Conditioning",
                2600.0, 4200.0, 6200.0, 9500.0
        );

        createHotelWithRooms(
                "Palm Breeze Luxury Villas",
                "Goa",
                "Secluded tropical private villas in South Goa surrounded by swaying coconut groves and peaceful beaches.",
                4.9,
                "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2800.0, 4500.0, 6800.0, 10500.0
        );

        // ================= HYDERABAD (3 Hotels) =================
        createHotelWithRooms(
                "Royal Heritage Hotel",
                "Hyderabad",
                "Experience royal Nizami hospitality, antique colonial architecture, courtyards, and authentic Hyderabadi culinary feasts.",
                4.6,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Gym, Room Service, Air Conditioning",
                2200.0, 3200.0, 4800.0, 7500.0
        );

        createHotelWithRooms(
                "Pearl Continental Hotel",
                "Hyderabad",
                "Luxury 5-star hotel located near HITEC City with lavish ballroom, heated spa, and Mughlai dining.",
                4.7,
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2400.0, 3500.0, 5200.0, 8000.0
        );

        createHotelWithRooms(
                "Nizami Palace Boutique Stay",
                "Hyderabad",
                "Charming historic boutique hotel facing Hussain Sagar Lake with authentic royal chandeliers and courtyard dinners.",
                4.5,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                2000.0, 3000.0, 4600.0, 7100.0
        );

        // ================= OOTY (3 Hotels) =================
        createHotelWithRooms(
                "Green Valley Resort",
                "Ooty",
                "Nestled amidst misty Nilgiri hills and sprawling tea gardens, offering serene mountain vistas, pine forests, and fireplace chalets.",
                4.9,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                1800.0, 2800.0, 4200.0, 6500.0
        );

        createHotelWithRooms(
                "Misty Pine Highlands Resort",
                "Ooty",
                "Scenic hillside resort overlooking Doddabetta Peak with cozy timber lodges and fragrant eucalyptus gardens.",
                4.8,
                "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                1950.0, 3100.0, 4500.0, 6900.0
        );

        createHotelWithRooms(
                "Nilgiri Tea County Chalets",
                "Ooty",
                "Colonial-era tea estate manor offering fireplace suites, homemade chocolate workshops, and tea tasting tours.",
                4.9,
                "https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                2100.0, 3300.0, 4800.0, 7400.0
        );

        // ================= CHENNAI (3 Hotels) =================
        createHotelWithRooms(
                "City Central Hotel",
                "Chennai",
                "Modern contemporary business and leisure hotel located in downtown Chennai, minutes from Marina Beach, consulates, and shopping hubs.",
                4.5,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Gym, Room Service, Air Conditioning",
                2100.0, 3100.0, 4600.0, 7200.0
        );

        createHotelWithRooms(
                "Marina Bay Luxury Hotel",
                "Chennai",
                "Stunning coastal luxury hotel overlooking Marina Beach with private sea-facing balconies and Chettinad seafood dining.",
                4.6,
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2300.0, 3400.0, 5000.0, 7600.0
        );

        createHotelWithRooms(
                "Coromandel Heritage Resort",
                "Chennai",
                "Quiet luxury resort along East Coast Road with temple architecture, lush lawns, open-air pool, and wellness spa.",
                4.7,
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2500.0, 3600.0, 5300.0, 7900.0
        );

        // ================= MUMBAI (3 Hotels) - NEW DESTINATION =================
        createHotelWithRooms(
                "The Gateway View Hotel",
                "Mumbai",
                "Opulent sea-facing luxury hotel overlooking the Arabian Sea and historic Colaba waterfront with fine dining.",
                4.9,
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                3000.0, 4800.0, 7000.0, 11000.0
        );

        createHotelWithRooms(
                "Marine Plaza Luxury Stays",
                "Mumbai",
                "Chic luxury hotel along Marine Drive's Queen's Necklace with rooftop glass-bottom pool and skyline bar.",
                4.8,
                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2800.0, 4500.0, 6500.0, 10000.0
        );

        createHotelWithRooms(
                "Bandra Boutique Suites",
                "Mumbai",
                "Trendy boutique hotel in Bandra West near Bandstand with vibrant cafes, sea breeze, and artistic interiors.",
                4.7,
                "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                2500.0, 4000.0, 5800.0, 8800.0
        );

        // ================= JAIPUR (3 Hotels) - NEW DESTINATION =================
        createHotelWithRooms(
                "Jaipur Royal Haveli",
                "Jaipur",
                "Majestic heritage palace hotel featuring traditional Rajasthani frescoes, courtyard folk dances, and regal dining.",
                4.9,
                "https://images.unsplash.com/photo-1587874522487-fe10e954d035?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Room Service, Air Conditioning",
                2400.0, 3800.0, 5500.0, 8500.0
        );

        createHotelWithRooms(
                "Amber Fort View Resort",
                "Jaipur",
                "Tranquil luxury resort surrounded by the Aravalli hills with views of historic Amber Fort and royal gardens.",
                4.8,
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2200.0, 3500.0, 5000.0, 7800.0
        );

        createHotelWithRooms(
                "Maharaja Grand Palace",
                "Jaipur",
                "Exquisite 5-star palace hotel with marble arches, peacock courtyards, candlelit rooftop restaurant, and spa.",
                4.9,
                "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Swimming Pool, Restaurant, Gym, Room Service, Air Conditioning",
                2600.0, 4200.0, 6000.0, 9200.0
        );

        // ================= MANALI (3 Hotels) - NEW DESTINATION =================
        createHotelWithRooms(
                "Himalayan Snow Pine Resort",
                "Manali",
                "Alpine mountain luxury resort on the banks of the Beas River with private snow-view balconies and apple orchards.",
                4.8,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                2100.0, 3200.0, 4700.0, 7200.0
        );

        createHotelWithRooms(
                "Rohtang View Chalets",
                "Manali",
                "Cedar wood chalets with glass solariums, wood-burning fireplaces, and sweeping views of Solang Valley.",
                4.9,
                "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                2300.0, 3600.0, 5200.0, 7900.0
        );

        createHotelWithRooms(
                "Old Manali Boutique Lodge",
                "Manali",
                "Serene boutique mountain retreat tucked away in Old Manali pine forests with live music cafe and bonfire lawn.",
                4.7,
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
                "WiFi, Parking, Restaurant, Room Service, Air Conditioning",
                1900.0, 2900.0, 4300.0, 6600.0
        );
    }

    private void createHotelWithRooms(String name, String location, String description,
                                      Double rating, String imageUrl, String amenities,
                                      Double singlePrice, Double doublePrice, Double deluxePrice, Double suitePrice) {
        if (hotelRepository.existsByName(name)) {
            return;
        }

        Hotel hotel = new Hotel(null, name, location, description, rating, imageUrl, amenities);
        hotel = hotelRepository.save(hotel);

        roomRepository.save(new Room(null, hotel, "101", "SINGLE", singlePrice, 1,
                "Comfortable single room with scenic view, high-speed WiFi, and dedicated workspace."));
        roomRepository.save(new Room(null, hotel, "102", "DOUBLE", doublePrice, 2,
                "Spacious double bedroom with king bed, marble bath, and private balcony."));
        roomRepository.save(new Room(null, hotel, "201", "DELUXE", deluxePrice, 3,
                "Premium deluxe room featuring panoramic views and luxury lounge area."));
        roomRepository.save(new Room(null, hotel, "301", "SUITE", suitePrice, 4,
                "Presidential luxury suite with private Jacuzzi, dining room, and butler service."));
    }

    private void seedSampleBookings() {
        if (bookingRepository.count() > 0) return;

        userRepository.findByEmail("user@hotel.com").ifPresent(user -> {
            roomRepository.findAll().stream().findFirst().ifPresent(room -> {
                LocalDate checkIn = LocalDate.now().plusDays(10);
                LocalDate checkOut = LocalDate.now().plusDays(13);
                long nights = 3;
                double totalPrice = nights * room.getPricePerNight();

                Booking booking = new Booking();
                booking.setUser(user);
                booking.setRoom(room);
                booking.setCheckIn(checkIn);
                booking.setCheckOut(checkOut);
                booking.setGuests(Math.min(2, room.getCapacity()));
                booking.setTotalPrice(totalPrice);
                booking.setStatus("CONFIRMED");
                booking.setCreatedAt(LocalDateTime.now().minusDays(1));

                bookingRepository.save(booking);
            });
        });
    }
}
