function gerarFrase() {
    const categoriaSelect = document.getElementById('categoria');
    const fraseElement = document.getElementById('frase');
    const categoria = categoriaSelect.value;
    
    // Obtém as frases da categoria selecionada
    const frases = frasesRPG[categoria];
    
    if (frases && frases.length > 0) {
        // Escolhe uma frase aleatória
        const indiceAleatorio = Math.floor(Math.random() * frases.length);
        const fraseEscolhida = frases[indiceAleatorio];
        
        // Atualiza o texto com animação
        fraseElement.style.animation = 'none';
        fraseElement.offsetHeight; // Trigger reflow
        fraseElement.style.animation = 'fadeIn 0.5s ease-in';
        fraseElement.textContent = '"' + fraseEscolhida + '"';
    } else {
        fraseElement.textContent = "Categoria não encontrada. Por favor, selecione outra.";
    }
}

// Gerar uma frase inicial quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    gerarFrase();
});

// Permitir gerar nova frase ao mudar a categoria
document.getElementById('categoria').addEventListener('change', function() {
    gerarFrase();
});
