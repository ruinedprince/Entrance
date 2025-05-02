import React, { useState } from 'react';

export default function EventRegister() {
    const [formData, setFormData] = useState({
        nome: '',
        local: '',
        organizador_id: '',
        descricao: '',
        data_inicio: '',
        data_final: '',
        status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remover campos desnecessários
            delete formData.horario_utilizacao;
            delete formData.multiplo;
            delete formData.titulo;

            const response = await fetch('http://localhost:5000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Evento cadastrado com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar evento:', error);
            alert('Erro ao cadastrar evento. Tente novamente mais tarde.');
        }
    };

    return (
        <div>
            <h1>Cadastro de Evento</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                <br />
                <label htmlFor="local">Local:</label>
                <input type="text" id="local" name="local" value={formData.local} onChange={handleChange} required />
                <br />
                <label htmlFor="organizador_id">ID do Organizador:</label>
                <input type="number" id="organizador_id" name="organizador_id" value={formData.organizador_id} onChange={handleChange} required />
                <br />
                <label htmlFor="descricao">Descrição:</label>
                <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required />
                <br />
                <label htmlFor="data_inicio">Data de Início:</label>
                <input type="datetime-local" id="data_inicio" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required />
                <br />
                <label htmlFor="data_final">Data Final:</label>
                <input type="datetime-local" id="data_final" name="data_final" value={formData.data_final} onChange={handleChange} required />
                <br />
                <label htmlFor="status">Status:</label>
                <input type="text" id="status" name="status" value={formData.status} onChange={handleChange} required />
                <br />
                <button type="submit">Cadastrar Evento</button>
            </form>
        </div>
    );
}