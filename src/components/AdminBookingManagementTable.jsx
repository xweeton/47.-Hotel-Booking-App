import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking,
  deleteBooking,
  fetchBookings,
  reconfirmBooking,
} from "../features/bookings/bookingsSlice";
import LoadingSpinner from "./LoadingSpinner";
import { Button, Container, Table } from "react-bootstrap";
import { toast } from "react-toastify";

export default function AdminBookingManagementTable({ filter }) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);

  const handleCancel = async (booking_id) => {
    setIsLoadingButton(true);
    const action = await dispatch(cancelBooking(booking_id));

    if (cancelBooking.fulfilled.match(action)) {
      toast.success("Success to cancel booking by admin.");
    } else if (cancelBooking.rejected.match(action)) {
      console.error(action.error);
      toast.error("Failed to cancel booking by admin.");
    }
    setIsLoadingButton(false);
    dispatch(fetchBookings());
  };

  const handleReconfirm = async (booking_id) => {
    setIsLoadingButton(true);
    const action = await dispatch(reconfirmBooking(booking_id));

    if (reconfirmBooking.fulfilled.match(action)) {
      toast.success("Success to confirm booking by admin.");
    } else if (reconfirmBooking.rejected.match(action)) {
      console.error(action.error);
      toast.error("Failed to confirm booking by admin.");
    }
    setIsLoadingButton(false);
    dispatch(fetchBookings());
  };

  const handleDelete = async (booking_id) => {
    setIsLoadingButton(true);
    const action = await dispatch(deleteBooking(booking_id));

    if (deleteBooking.fulfilled.match(action)) {
      toast.success("Success to delete booking by admin.");
    } else if (deleteBooking.rejected.match(action)) {
      console.error(action.error);
      toast.error("Failed to delete booking by admin.");
    }
    setIsLoadingButton(false);
    dispatch(fetchBookings()); // re-fetch again for renew table
  };

  const sortedAndFilteredBookings =
    bookings.length > 0
      ? [...bookings]
          // in Redux, the state is immutable, should create a copy of the bookings (...) array before sorting it
          .sort((a, b) => a.booking_id - b.booking_id)
          .filter((booking) => {
            if (filter === "") return true; // If no filter is set, show all bookings
            return booking.status === filter; // Otherwise, only show bookings that match the filter
          })
      : [];

  return (
    <>
      {sortedAndFilteredBookings.length > 0 ? (
        <Container className="my-3">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Booking Date</th>
                <th>User ID</th>
                <th>User Email</th>
                <th>Room Number</th>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Room Location</th>
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Price/night</th>
                <th>Total nights</th>
                <th>Total Price</th>
                <th>Total Guests</th>
                <th>Status</th>
                <th>Description</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedAndFilteredBookings.map((booking, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {new Date(booking.booking_date).toLocaleDateString(
                        "en-CA"
                      )}
                    </td>
                    <td>{booking.user_id}</td>
                    <td>{booking.email}</td>
                    <td>{booking.room_id}</td>
                    <td>{booking.room_name}</td>
                    <td>{booking.room_type}</td>
                    <td>{booking.room_location}</td>
                    <td>
                      {new Date(booking.check_in_date).toLocaleDateString(
                        "en-CA"
                      )}
                    </td>
                    <td>
                      {new Date(booking.check_out_date).toLocaleDateString(
                        "en-CA"
                      )}
                    </td>
                    <td>{booking.price}</td>
                    <td>{booking.nights}</td>
                    <td>{booking.total_price}</td>
                    <td>{booking.guests}</td>
                    <td>{booking.status}</td>
                    <td>{booking.description}</td>
                    <td>{booking.phone_number}</td>
                    {filter === "confirmed" ? (
                      <td>
                        <Button
                          onClick={() => handleCancel(booking.booking_id)}
                          disabled={isLoadingButton}
                          className="w-100"
                          variant="dark"
                        >
                          {isLoadingButton ? <LoadingSpinner /> : "Cancel"}
                        </Button>
                      </td>
                    ) : (
                      <>
                        <td>
                          <Button
                            onClick={() => handleReconfirm(booking.booking_id)}
                            disabled={isLoadingButton}
                            className="w-100"
                            variant="success"
                          >
                            {isLoadingButton ? <LoadingSpinner /> : "Confirm"}
                          </Button>

                          <Button
                            onClick={() => handleDelete(booking.booking_id)}
                            disabled={isLoadingButton}
                            className="w-100 mt-2"
                            variant="danger"
                          >
                            {isLoadingButton ? <LoadingSpinner /> : "Delete"}
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      ) : (
        <div className="mt-5">
          <h3>No bookings found...</h3>
        </div>
      )}
    </>
  );
}
