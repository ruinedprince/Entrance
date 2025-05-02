import React, { useEffect, useState } from 'react';

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
                alert('Erro ao carregar usuários.');
            }
        }
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Usuários Cadastrados</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.cpf}</td>
                            <td>{user.telefone}</td>
                            <td>{user.data_nascimento}</td>
                            <td>{user.cidade}</td>
                            <td>{user.estado}</td>
                            <td>
                                <button onClick={() => alert(`Editar usuário: ${user.id}`)}>Editar</button>
                                <button onClick={() => alert(`Desativar usuário: ${user.id}`)}>Desativar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}