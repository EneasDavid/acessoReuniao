document.addEventListener('DOMContentLoaded', () => {
    const reserva = {
        nome: 'Jubileu',
        sala: 'Coworking 2',
        data: '00/00/0000',
        hora: '15:00'
    };

    document.getElementById('nome-cancelamento').textContent = reserva.nome;
    document.getElementById('sala-cancelamento').textContent = reserva.sala;
    document.getElementById('data-cancelamento').textContent = reserva.data;
    document.getElementById('hora-cancelamento').textContent = reserva.hora;
});
