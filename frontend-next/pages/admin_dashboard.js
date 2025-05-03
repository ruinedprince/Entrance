import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch users and their associated events
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.users));

    // Fetch all events
    fetch('/api/admin/events')
      .then((res) => res.json())
      .then((data) => setEvents(data.events));
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