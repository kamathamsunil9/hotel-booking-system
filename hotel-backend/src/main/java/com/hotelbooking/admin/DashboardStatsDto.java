package com.hotelbooking.admin;

import com.hotelbooking.booking.BookingDto;

import java.util.List;

public class DashboardStatsDto {
    private long totalHotels;
    private long totalRooms;
    private long totalUsers;
    private long totalBookings;
    private double totalRevenue;
    private List<BookingDto> recentBookings;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalHotels, long totalRooms, long totalUsers, long totalBookings, double totalRevenue, List<BookingDto> recentBookings) {
        this.totalHotels = totalHotels;
        this.totalRooms = totalRooms;
        this.totalUsers = totalUsers;
        this.totalBookings = totalBookings;
        this.totalRevenue = totalRevenue;
        this.recentBookings = recentBookings;
    }

    public long getTotalHotels() {
        return totalHotels;
    }

    public void setTotalHotels(long totalHotels) {
        this.totalHotels = totalHotels;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<BookingDto> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingDto> recentBookings) {
        this.recentBookings = recentBookings;
    }
}
