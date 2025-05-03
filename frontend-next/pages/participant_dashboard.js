import React, { useEffect, useState } from 'react';

const ParticipantDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch tickets associated with the participant
    fetch('/api/participant/tickets')
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets));
  }, []);

  return (
    <div>
      <h1>Participant Dashboard</h1>

      <h2>Your Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            {ticket.eventName} - {ticket.date} - {ticket.seat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantDashboard;