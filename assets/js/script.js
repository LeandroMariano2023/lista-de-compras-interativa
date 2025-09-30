// --- JS COMPLETO (script.js) ---

// 1. VARIÁVEIS DE DOM (Global, mas tratadas com if)
// Se estiver em lista.html, form será null. Se estiver em cadastro.html, tabela será null.
const form = document.getElementById("form_cadastro");
const tabela = document.getElementById("tabela_produtos"); 
// (Você precisa garantir que o <tbody> no lista.html tenha o id="tabela_produtos")

// --- FUNÇÃO DE EXCLUSÃO (DELETE) ---
function excluirProduto(id) {
    // Pede confirmação ao usuário
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        // 1. Pega os produtos atuais do localStorage
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        
        // 2. Filtra o array, mantendo APENAS os produtos que NÃO têm o ID passado
        produtos = produtos.filter(produto => produto.id !== id);
        
        // 3. Salva a lista atualizada no localStorage
        localStorage.setItem("produtos", JSON.stringify(produtos));
        
        // 4. Recarrega a tabela para refletir a mudança
        carregarProdutos();
        alert("Produto excluído com sucesso!");
    }
}

function editarProduto(id) {
    // 1. Pega os produtos atuais do localStorage
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    // 2. Encontra o ÍNDICE do produto no array. O índice é crucial para substituir!
    const index = produtos.findIndex(produto => produto.id === id); 

    // Checa se encontrou
    if (index === -1) {
        alert('Produto não encontrado!');
        return; 
    }

    // 3. Pega o objeto atual para edição (fazendo uma cópia para não alterar o original ainda)
    const produtoAntigo = produtos[index];

    // 4. Captura o NOVO NOME do usuário (simplificando a captura para este passo)
    const novoNome = prompt("Digite o NOVO nome para: " + produtoAntigo.nome, produtoAntigo.nome);
    const novoPreco = prompt("Digite o NOVO preço para: " + produtoAntigo.preco, produtoAntigo.preco);

    // Se o usuário digitou um nome e não cancelou o prompt
    if (novoNome !== null ) {
        // 5. Cria um novo objeto com os dados antigos e o nome ATUALIZADO
        const produtoAtualizado = {
            ...produtoAntigo, // Spreads (espalha) todas as propriedades antigas
            nome: novoNome,    // Sobrescreve apenas a propriedade 'nome'
            preco: novoPreco     // Sobrescreve apenas a propriedade 'nome'
        };

        // 6. SUBSTITUI o objeto antigo pelo objeto atualizado no array
        produtos[index] = produtoAtualizado;
        
        // 7. Salva a lista atualizada no localStorage
        localStorage.setItem("produtos", JSON.stringify(produtos));
        
        // 8. Recarrega a lista
        carregarProdutos();
        alert(`Produto ${novoNome} atualizado com sucesso!`);
    }
}


// --- FUNÇÃO DE LEITURA (READ) ---
function carregarProdutos() {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    
    // ✅ TRATAMENTO DE DEPENDÊNCIA: Só executa se o elemento tabela existir
    if (tabela) {
        tabela.innerHTML = ""; // Limpa a tabela para recarregar os dados

        produtos.forEach((produto) => {
            // Usando parseFloat e toFixed para garantir que o preço tenha 2 casas decimais
            const precoFormatado = parseFloat(produto.preco).toFixed(2);
            
            tabela.innerHTML += `
                <tr>
                    <td>${produto.nome}</td>
                    <td>R$ ${precoFormatado}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.origem}</td>
                    <td>${produto.lote}</td>
                    <td>${produto.data_de_validade}</td>
                    <td>
                        <button onclick="editarProduto(${produto.id})">Editar</button>
                        <button onclick="excluirProduto(${produto.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }
}


// --- FUNÇÃO DE CRIAÇÃO (CREATE) ---
// ✅ TRATAMENTO DE DEPENDÊNCIA: O código de cadastro SÓ roda se o elemento form existir na página
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        // Captura de dados
        const nome = document.getElementById("nome").value;
        const preco = document.getElementById("preco").value;
        const categoria = document.getElementById("categoria").value;
        const origem = document.getElementById("origem").value;
        const lote = document.getElementById("lote").value;
        const data_de_validade = document.getElementById("data_de_validade").value;
        
        const id = Date.now(); // Geração do ID Único
        
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        
        const novoProduto = { id, nome, preco, categoria, origem, lote, data_de_validade };
        
        produtos.push(novoProduto);
        
        localStorage.setItem("produtos", JSON.stringify(produtos));
        
        alert("Produto cadastrado!");
        
        form.reset();
        
        // Se a listagem estiver na mesma página (neste caso não está), chamaríamos carregarProdutos() aqui
    });
}

// --- EXECUÇÃO INICIAL ---
// A função deve ser chamada ao carregar a página (especialmente em lista.html)
carregarProdutos();