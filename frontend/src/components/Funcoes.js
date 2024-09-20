// funcoes.js

// Função para formatar a data
function formatDate(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Exportar a função para que possa ser usada em outros arquivos
export { formatDate };
