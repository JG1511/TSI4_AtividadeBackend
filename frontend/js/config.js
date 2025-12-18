// Configuração da API
const API_CONFIG = {
    // Para desenvolvimento local
    BASE_URL: 'http://127.0.0.1:8000',
    
    // Para produção (descomente e ajuste a URL da AWS)
    // BASE_URL: 'http://seu-backend.elasticbeanstalk.com',
    
    // Endpoints
    ENDPOINTS: {
        listarCarros: '/autoprime/listarCarros/',
        getCarro: '/autoprime/getCarro/',
        saveCarro: '/autoprime/saveCarro/',
        updateCarro: '/autoprime/updateCarro/',
        deleteCarro: '/autoprime/deleteCarro/'
    }
};

// Função auxiliar para construir URL completa
function getFullUrl(endpoint) {
    return API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS[endpoint];
}
