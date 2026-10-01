# Hotel Booking and Management System (StayHaven)

A full-stack, production-ready Hotel Booking and Management application engineered with **Spring Boot 3 (Java 21)**, **React**, **PostgreSQL 15**, and **Docker**.

---

## 📌 Project Overview

**StayHaven** provides an intuitive, streamlined hotel discovery, real-time availability checking, and instant room booking experience for users, along with a management portal for administrators.

### Core Highlights:
- **No Payment Gateway Friction:** Instant reservation directly upon clicking **"Confirm Booking"** without third-party gateways (Stripe, Razorpay, UPI, etc.).
- **Rigorous Overlap Protection:** Backend-enforced date-overlap booking verification prevents double-booking of any room across overlapping date ranges.
- **Dynamic Price Integrity:** Total amount is calculated on the backend (`nights × pricePerNight`); client-submitted total amounts are never trusted.
- **Multi-Role Security:** Secured with Spring Security, BCrypt hashing, and stateless JWT tokens with role-based route guards.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18
- **Language:** JavaScript (ES6+)
- **Routing:** React Router DOM (v6)
- **HTTP Client:** Axios with JWT request/response interceptors
- **Styling:** Custom Vanilla CSS (Modern, responsive, hotel-themed design)

### Backend
- **Framework:** Spring Boot 3.3.4
- **Language:** Java 21
- **Persistence:** Spring Data JPA / Hibernate
- **Database:** PostgreSQL 15
- **Security:** Spring Security 6 & BCrypt password hashing
- **Token Auth:** JSON Web Tokens (JJWT 0.11.5)
- **Build Tool:** Maven 3.9+ / Maven Wrapper

### Deployment & Containerization
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (Serving React production build)

---

## 👥 User Roles & Permissions

| Role | Permissions & Capabilities |
| :--- | :--- |
| **USER** | Register, Login, Browse hotels, Filter by destination/rating/price, View hotel details & amenities, Select dates & guests, Verify room availability, Instant room booking, View personal bookings, Cancel bookings. |
| **ADMIN** | Login, View Administrative Dashboard (Total hotels, rooms, users, bookings, total revenue), Add / Edit / Delete Hotels, Add / Edit / Delete Rooms, View all customer reservations, Update booking statuses (`CONFIRMED`, `CANCELLED`, `COMPLETED`), View registered users. |

---

## 🔐 Default Credentials

The system pre-seeds default credentials on startup:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@hotel.com` | `admin123` |
| **Standard User** | `user@hotel.com` | `user123` |

> *Quick Demo Login buttons are also available on the Login screen to autofill these credentials with a single click.*

---

## 🏨 Pre-Seeded Sample Hotels & Rooms (24 Hotels Across 8 Destinations)

The application is pre-populated on startup with **3 hotels per destination** (24 luxury properties total, each featuring 4 room tiers: Single, Double, Deluxe, Suite):

1. **Bangalore**
   - *Grand Palace Hotel* (Starting at ₹2,000 / night)
   - *Silicon Valley Grand Hotel* (Starting at ₹2,200 / night)
   - *Garden City Luxury Suites* (Starting at ₹1,900 / night)
2. **Goa**
   - *Ocean Pearl Resort* (Starting at ₹2,500 / night)
   - *Sunset Bay Beach Resort* (Starting at ₹2,600 / night)
   - *Palm Breeze Luxury Villas* (Starting at ₹2,800 / night)
3. **Hyderabad**
   - *Royal Heritage Hotel* (Starting at ₹2,200 / night)
   - *Pearl Continental Hotel* (Starting at ₹2,400 / night)
   - *Nizami Palace Boutique Stay* (Starting at ₹2,000 / night)
4. **Ooty**
   - *Green Valley Resort* (Starting at ₹1,800 / night)
   - *Misty Pine Highlands Resort* (Starting at ₹1,950 / night)
   - *Nilgiri Tea County Chalets* (Starting at ₹2,100 / night)
5. **Chennai**
   - *City Central Hotel* (Starting at ₹2,100 / night)
   - *Marina Bay Luxury Hotel* (Starting at ₹2,300 / night)
   - *Coromandel Heritage Resort* (Starting at ₹2,500 / night)
6. **Mumbai** *(New Destination)*
   - *The Gateway View Hotel* (Starting at ₹3,000 / night)
   - *Marine Plaza Luxury Stays* (Starting at ₹2,800 / night)
   - *Bandra Boutique Suites* (Starting at ₹2,500 / night)
7. **Jaipur** *(New Destination)*
   - *Jaipur Royal Haveli* (Starting at ₹2,400 / night)
   - *Amber Fort View Resort* (Starting at ₹2,200 / night)
   - *Maharaja Grand Palace* (Starting at ₹2,600 / night)
8. **Manali** *(New Destination)*
   - *Himalayan Snow Pine Resort* (Starting at ₹2,100 / night)
   - *Rohtang View Chalets* (Starting at ₹2,300 / night)
   - *Old Manali Boutique Lodge* (Starting at ₹1,900 / night)

---

## 🗄 Database Schema

PostgreSQL Database Name: `hoteldb`

### Tables:
- **`users`**: `id`, `name`, `email` (unique), `password` (BCrypt), `role` (`USER`, `ADMIN`)
- **`hotels`**: `id`, `name`, `location`, `description`, `rating`, `image_url`, `amenities`
- **`rooms`**: `id`, `hotel_id` (FK -> `hotels.id`), `room_number`, `room_type`, `price_per_night`, `capacity`, `description`
- **`bookings`**: `id`, `user_id` (FK -> `users.id`), `room_id` (FK -> `rooms.id`), `check_in`, `check_out`, `guests`, `total_price`, `status`, `created_at`

---

## 📡 REST API Endpoints

### Authentication
- `POST /auth/register` — Register a new customer
- `POST /auth/login` — Authenticate and receive JWT token

### Hotels
- `GET /api/hotels` — Browse all hotels (supports `?location=` query)
- `GET /api/hotels/{id}` — Get single hotel with full room list
- `GET /api/hotels/locations` — Get list of distinct locations

### Rooms & Availability
- `GET /api/hotels/{hotelId}/rooms` — List rooms belonging to a hotel
- `GET /api/rooms/{roomId}` — Get room details
- `GET /api/rooms/{roomId}/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD` — Check date availability and price quote

### Bookings (Authenticated Users)
- `POST /api/bookings` — Create a new booking
- `GET /api/bookings/my` — Get logged-in user's bookings
- `GET /api/bookings/{id}` — Get specific booking details
- `PUT /api/bookings/{id}/cancel` — Cancel an existing booking

### Admin APIs (Requires `ROLE_ADMIN`)
- `GET /api/admin/dashboard` — Statistics (Total hotels, rooms, users, bookings, revenue)
- `POST /api/admin/hotels` — Create a new hotel
- `PUT /api/admin/hotels/{id}` — Update hotel details
- `DELETE /api/admin/hotels/{id}` — Delete a hotel
- `POST /api/admin/rooms` — Create a room
- `PUT /api/admin/rooms/{id}` — Update room details
- `DELETE /api/admin/rooms/{id}` — Delete a room
- `GET /api/admin/bookings` — View all customer bookings
- `PUT /api/admin/bookings/{id}/status` — Update booking status (`CONFIRMED`, `CANCELLED`, `COMPLETED`)
- `GET /api/admin/users` — List registered users

---

## 📂 Project Structure

```
hotel-booking-system/
├── docker-compose.yml
├── README.md
├── .gitignore
│
├── hotel-backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       └── main/
│           ├── java/com/hotelbooking/
│           │   ├── HotelBookingApplication.java
│           │   ├── auth/          # AuthController, AuthService, DTOs
│           │   ├── user/          # User, UserRepository, UserDto
│           │   ├── hotel/         # Hotel, HotelRepository, HotelService, HotelController, DTOs
│           │   ├── room/          # Room, RoomRepository, RoomService, RoomController, DTOs
│           │   ├── booking/       # Booking, BookingRepository, BookingService, BookingController, DTOs
│           │   ├── admin/         # AdminController, DashboardStatsDto
│           │   ├── security/      # SecurityConfig, JwtUtils, JwtFilter, UserDetailsService
│           │   └── config/        # DataInitializer, GlobalExceptionHandler, Exceptions
│           └── resources/
│               ├── application.properties
│               └── data.sql
│
└── hotel-frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── index.js
        ├── index.css
        ├── context/
        │   └── AuthContext.js
        ├── services/
        │   └── api.js
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── PrivateRoute.js
        └── pages/
            ├── Home.js
            ├── Login.js
            ├── Register.js
            ├── Hotels.js
            ├── HotelDetails.js
            ├── Booking.js
            ├── BookingSuccess.js
            ├── MyBookings.js
            ├── Profile.js
            ├── AdminDashboard.js
            ├── ManageHotels.js
            ├── ManageRooms.js
            ├── ManageBookings.js
            └── ManageUsers.js
```

---

## 🚀 How to Run

### Option 1: Run with Docker Compose (Recommended)

1. Make sure Docker Desktop is running.
2. From the project root (`hotel-booking-system/`), start the services:
   ```bash
   docker compose up --build -d
   ```
3. The containers will launch:
   - **PostgreSQL Database:** Port `5432`
   - **Spring Boot Backend:** `http://localhost:8083`
   - **React Frontend:** `http://localhost:3000`
4. Stop containers anytime with:
   ```bash
   docker compose down
   ```

---

### Option 2: Run Locally (Without Docker)

#### Prerequisites:
- Java 21 JDK
- Node.js 18+ and npm
- PostgreSQL running locally with database `hoteldb` on port 5432 (user: `postgres`, password: `password`)

#### 1. Start Backend:
```bash
cd hotel-backend
./mvnw spring-boot:run
```
*(On Windows CMD: `mvnw.cmd spring-boot:run`)*
Backend starts on `http://localhost:8083`.

#### 2. Start Frontend:
```bash
cd hotel-frontend
npm install
npm start
```
Frontend opens in browser at `http://localhost:3000`.

---

## 🧪 Testing Checklist

- [x] Spring Boot 3.3.4 backend builds cleanly (`mvn clean package -DskipTests`).
- [x] React frontend builds cleanly without warnings.
- [x] Automatic database schema generation and initial data seeding.
- [x] User registration and BCrypt password encryption.
- [x] Login with JWT generation and token verification.
- [x] Hotel listings with dynamic search and filters.
- [x] Room inventory and pricing calculation.
- [x] Room availability checking with overlap prevention logic.
- [x] Instant booking without payment gateways.
- [x] Customer booking history and cancellation.
- [x] Admin dashboard KPI metrics and management panels.
