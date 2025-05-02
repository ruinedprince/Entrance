import React, { useState, useEffect } from 'react';

export default function EventTicket() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        fullName: '',
        city: '',
        state: '',
        address: '',
        zip: '',
        cpf: '',
        phone: ''
    });

    useEffect(() => {
        // Fetch events from the backend
        fetch('http://localhost:5000/events')
            .then((response) => response.json())
            .then((data) => setEvents(data));
    }, []);

    const handleEventSelect = (eventId) => {
        setSelectedEvent(eventId);
        // Fetch tickets for the selected event
        fetch(`http://localhost:5000/events/${eventId}/tickets`)
            .then((response) => response.json())
            .then((data) => setTickets(data));
    };

    const handleTicketSelect = (ticketId) => {
        setSelectedTicket(ticketId);
        // Check if the user is logged in
        if (!isLoggedIn) {
            setShowLogin(true);
        } else {
            reserveTicket(ticketId);
        }
    };

    const reserveTicket = (ticketId) => {
        fetch('http://localhost:5000/tickets/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('Ingresso reservado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao reservar ingresso:', error);
            });
    };

    const handleLogin = () => {
        fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userData.email, password: userData.password }),
        })
            .then((response) => {
                if (response.ok) {
                    setIsLoggedIn(true);
                    setShowLogin(false);
                    alert('Login bem-sucedido!');
                } else {
                    alert('Credenciais inválidas!');
                }
            })
            .catch((error) => {
                console.error('Erro ao fazer login:', error);
            });
    };

    const handleRegister = () => {
        fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.ok) {
                    setIsLoggedIn(true);
                    setShowRegister(false);
                    alert('Cadastro realizado com sucesso!');
                } else {
                    alert('Erro ao realizar cadastro!');
                }
            })
            .catch((error) => {
                console.error('Erro ao cadastrar usuário:', error);
            });
    };

    return (
        <div>
            <h1>Seleção de Ingressos</h1>

            {!selectedEvent ? (
                <div>
                    <h2>Eventos Disponíveis</h2>
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                {event.nome} <button onClick={() => handleEventSelect(event.id)}>Ver Detalhes</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h2>Ingressos para o Evento</h2>
                    <ul>
                        {tickets.map((ticket) => (
                            <li key={ticket.id}>
                                {ticket.tipo} - R$ {ticket.preco} <button onClick={() => handleTicketSelect(ticket.id)}>Selecionar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showLogin && (
                <div>
                    <h2>Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                    <button onClick={handleLogin}>Entrar</button>
                    <button onClick={() => setShowRegister(true)}>Cadastrar</button>
                </div>
            )}

            {showRegister && (
                <div>
                    <h2>Cadastro</h2>
                    <input
                        type="text"
                        placeholder="Nome Completo"
                        value={userData.fullName}
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Cidade"
                        value={userData.city}
                        onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Estado"
                        value={userData.state}
                        onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={userData.address}
                        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CEP"
                        value={userData.zip}
                        onChange={(e) => setUserData({ ...userData, zip: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CPF"
                        value={userData.cpf}
                        onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Telefone"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    />
                    <button onClick={handleRegister}>Cadastrar</button>
                </div>
            )}
        </div>
    );
}