import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TicketEdit() {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState({
        tipo: '',
        preco: '',
        quantidade_disponivel: '',
        data_inicio: '',
        data_final: '',
        evento_id: '' // Adicionando evento_id ao formData
    });

    useEffect(() => {
        if (id) {
            async function fetchTicketDetails() {
                try {
                    const response = await fetch(`http://localhost:5000/tickets/${id}`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar detalhes do ingresso');
                    }
                    if (response.headers.get('Content-Type')?.includes('application/json')) {
                        const data = await response.json();
                        setFormData({
                            tipo: data.tipo,
                            preco: data.preco,
                            quantidade_disponivel: data.quantidade_disponivel,
                            data_inicio: data.data_inicio,
                            data_final: data.data_final,
                            evento_id: data.evento_id // Adicionando evento_id ao formData
                        });
                    } else {
                        throw new Error('Resposta inválida do servidor');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Erro ao carregar detalhes do ingresso.');
                }
            }
            fetchTicketDetails();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Ingresso atualizado com sucesso!');
                router.push(`/event_details?id=${formData.evento_id}`);
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar ingresso:', error);
            alert('Erro ao atualizar ingresso. Tente novamente mais tarde.');
        }
    };

    return (
        <div>
            <h1>Editar Ingresso</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="tipo">Tipo de Ingresso:</label>
                <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required>
                    <option value="">Selecione o tipo</option>
                    <option value="unitario">Unitário</option>
                    <option value="multiplo">Múltiplo</option>
                </select>
                <br />
                <label htmlFor="preco">Preço:</label>
                <input type="number" id="preco" name="preco" value={formData.preco} onChange={handleChange} required />
                <br />
                <label htmlFor="quantidade_disponivel">Quantidade Disponível:</label>
                <input type="number" id="quantidade_disponivel" name="quantidade_disponivel" value={formData.quantidade_disponivel} onChange={handleChange} required />
                <br />
                <label htmlFor="data_inicio">Data de Início:</label>
                <input type="datetime-local" id="data_inicio" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required />
                <br />
                <label htmlFor="data_final">Data Final:</label>
                <input type="datetime-local" id="data_final" name="data_final" value={formData.data_final} onChange={handleChange} required />
                <br />
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
}