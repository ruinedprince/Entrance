import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EventEdit() {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        data_inicio: '',
        data_final: '',
        local: '',
        organizador_id: '',
        status: ''
    });

    useEffect(() => {
        if (id) {
            async function fetchEvent() {
                try {
                    const response = await fetch(`http://localhost:5000/events/${id}`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar evento');
                    }
                    const data = await response.json();
                    setFormData(data);
                } catch (error) {
                    console.error(error);
                    alert('Erro ao carregar evento.');
                }
            }
            fetchEvent();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Evento atualizado com sucesso!');
                router.push('/event_list');
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            alert('Erro ao atualizar evento. Tente novamente mais tarde.');
        }
    };

    return (
        <div>
            <h1>Editar Evento</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
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
                <label htmlFor="local">Local:</label>
                <input type="text" id="local" name="local" value={formData.local} onChange={handleChange} required />
                <br />
                <label htmlFor="organizador_id">ID do Organizador:</label>
                <input type="number" id="organizador_id" name="organizador_id" value={formData.organizador_id} onChange={handleChange} required />
                <br />
                <label htmlFor="status">Status:</label>
                <input type="text" id="status" name="status" value={formData.status} onChange={handleChange} required />
                <br />
                <button type="submit">Atualizar Evento</button>
            </form>
        </div>
    );
}