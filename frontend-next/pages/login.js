import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao fazer login');
                return;
            }

            const data = await response.json();
            console.log('Response data:', data); // Log full response data for debugging
            alert('Login bem-sucedido!');

            // Redirect based on user role
            if (data.role) {
                console.log('Valor de role recebido no frontend:', data.role); // Log para depuração
                console.log('Redirecting based on role:', data.role);
                if (data.role === 'administrador') {
                    router.push('/admin_dashboard');
                } else if (data.role === 'participante') {
                    router.push('/participant_dashboard');
                } else {
                    console.error('Unknown role:', data.role);
                }
            } else {
                console.error('Role not found in response data:', data);
            }
        } catch (err) {
            setError('Erro ao conectar ao servidor');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="password">Senha:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}