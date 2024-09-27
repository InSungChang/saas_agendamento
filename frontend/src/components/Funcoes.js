// Função para formatar a data
function formatDate(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatarDataHora(data, hora) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia} ${hora}:00`;
};

function formatarData(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // `getMonth()` retorna de 0 a 11
    const dia = String(date.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}
// Exportar a função para que possa ser usada em outros arquivos
export { formatDate, formatarDataHora, formatarData };
