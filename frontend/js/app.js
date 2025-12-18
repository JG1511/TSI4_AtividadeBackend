// Elementos do DOM
const formAddCarro = document.getElementById('formAddCarro');
const formBuscarCarro = document.getElementById('formBuscarCarro');
const formEditarCarro = document.getElementById('formEditarCarro');
const btnListarCarros = document.getElementById('btnListarCarros');
const listaCarros = document.getElementById('listaCarros');
const resultadoBusca = document.getElementById('resultadoBusca');
const mensagemDiv = document.getElementById('mensagem');
const modal = document.getElementById('modalEditar');
const closeModal = document.getElementsByClassName('close')[0];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarCarros();
    
    // Event Listeners
    formAddCarro.addEventListener('submit', adicionarCarro);
    formBuscarCarro.addEventListener('submit', buscarCarro);
    formEditarCarro.addEventListener('submit', editarCarro);
    btnListarCarros.addEventListener('click', carregarCarros);
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo = 'sucesso') {
    mensagemDiv.textContent = texto;
    mensagemDiv.className = `mensagem ${tipo}`;
    mensagemDiv.style.display = 'block';
    
    setTimeout(() => {
        mensagemDiv.style.display = 'none';
    }, 3000);
}

// Carregar lista de carros
async function carregarCarros() {
    try {
        listaCarros.innerHTML = '<p class="loading">Carregando...</p>';
        
        const response = await fetch(getFullUrl('listarCarros'));
        
        if (!response.ok) {
            throw new Error('Erro ao carregar carros');
        }
        
        const data = await response.json();
        
        if (data.carros && data.carros.length > 0) {
            listaCarros.innerHTML = '';
            data.carros.forEach(carro => {
                const carroDiv = criarElementoCarro(carro);
                listaCarros.appendChild(carroDiv);
            });
        } else {
            listaCarros.innerHTML = '<p class="loading">Nenhum carro cadastrado ainda.</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        listaCarros.innerHTML = '<p class="loading" style="color: red;">Erro ao carregar carros. Verifique se o backend está rodando.</p>';
        mostrarMensagem('Erro ao carregar carros: ' + error.message, 'erro');
    }
}

// Criar elemento HTML para um carro
function criarElementoCarro(carro) {
    const div = document.createElement('div');
    div.className = 'carro-item';
    div.innerHTML = `
        <div class="carro-info">
            <h3>${carro.modelo}</h3>
            <p>R$ ${parseFloat(carro.preco).toFixed(2)}</p>
        </div>
        <div class="carro-actions">
            <button class="btn btn-edit" onclick="abrirModalEditar(${carro.id}, '${carro.modelo}', ${carro.preco})">
                ✏️ Editar
            </button>
            <button class="btn btn-delete" onclick="deletarCarro(${carro.id})">
                🗑️ Deletar
            </button>
        </div>
    `;
    return div;
}

// Adicionar novo carro
async function adicionarCarro(e) {
    e.preventDefault();
    
    const modelo = document.getElementById('modelo').value;
    const preco = document.getElementById('preco').value;
    
    try {
        const response = await fetch(getFullUrl('saveCarro'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modelo, preco })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('Carro adicionado com sucesso!', 'sucesso');
            formAddCarro.reset();
            carregarCarros();
        } else {
            throw new Error(data.error || 'Erro ao adicionar carro');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao adicionar carro: ' + error.message, 'erro');
    }
}

// Buscar preço de um carro
async function buscarCarro(e) {
    e.preventDefault();
    
    const modelo = document.getElementById('modeloBusca').value;
    
    try {
        const response = await fetch(getFullUrl('getCarro'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modelo })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            resultadoBusca.innerHTML = `
                <h3>Resultado:</h3>
                <p><strong>Modelo:</strong> ${modelo}</p>
                <p><strong>Preço:</strong> R$ ${parseFloat(data.preco).toFixed(2)}</p>
            `;
            resultadoBusca.style.display = 'block';
            mostrarMensagem('Carro encontrado!', 'sucesso');
        } else {
            throw new Error(data.error || 'Carro não encontrado');
        }
    } catch (error) {
        console.error('Erro:', error);
        resultadoBusca.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        resultadoBusca.style.display = 'block';
        mostrarMensagem('Erro ao buscar carro: ' + error.message, 'erro');
    }
}

// Abrir modal de edição
function abrirModalEditar(id, modelo, preco) {
    document.getElementById('editId').value = id;
    document.getElementById('editModelo').value = modelo;
    document.getElementById('editPreco').value = preco;
    modal.style.display = 'block';
}

// Editar carro
async function editarCarro(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const modelo = document.getElementById('editModelo').value;
    const preco = document.getElementById('editPreco').value;
    
    try {
        const response = await fetch(getFullUrl('updateCarro') + `${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modelo, preco })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('Carro atualizado com sucesso!', 'sucesso');
            modal.style.display = 'none';
            carregarCarros();
        } else {
            throw new Error(data.error || 'Erro ao atualizar carro');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao atualizar carro: ' + error.message, 'erro');
    }
}

// Deletar carro
async function deletarCarro(id) {
    if (!confirm('Tem certeza que deseja deletar este carro?')) {
        return;
    }
    
    try {
        const response = await fetch(getFullUrl('deleteCarro') + `${id}/`, {
            method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('Carro deletado com sucesso!', 'sucesso');
            carregarCarros();
        } else {
            throw new Error(data.error || 'Erro ao deletar carro');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao deletar carro: ' + error.message, 'erro');
    }
}
