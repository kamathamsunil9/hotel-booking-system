package com.hotelbooking.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class BookingStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "CONFIRMED|CANCELLED|COMPLETED", message = "Status must be CONFIRMED, CANCELLED, or COMPLETED")
    private String status;

    public BookingStatusUpdateRequest() {
    }

    public BookingStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
