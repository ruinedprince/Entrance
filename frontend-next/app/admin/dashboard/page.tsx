"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const [users, setUsers] = useState<{ id: string; name: string; eventCount: number }[]>([]);
  const [events, setEvents] = useState<{ id: string; name: string; date: string; location: string }[]>([]);

  useEffect(() => {
    // Fetch users and their associated events
    fetch(`${BASE_URL}/api/admin/users`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Users data fetched:", data); // Log para depuração
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch all events
    fetch(`${BASE_URL}/api/admin/events`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Events data fetched:", data); // Log para depuração
        setEvents(data.events);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Users and Associated Events</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.eventCount} events
          </li>
        ))}
      </ul>

      <h2>All Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.name} - {event.date} - {event.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;