document.addEventListener('DOMContentLoaded', function () {
  const formReviews = document.getElementById('feedback-form');

  formReviews.addEventListener('submit', function (event) {
    event.preventDefault();

    const dados = coletarDadosFormReview();
    const cardReview = criarCardReview(dados);
    addCardReviewToReviewContainer(cardReview);
    formReviews.reset();
  });
});

function coletarDadosFormReview(){
    const titulo = document.getElementById('titulo').value;
    const reviewText = document.getElementById('review').value;
    const nome = document.getElementById('name').value;
    const destino = document.getElementById('destination').value;
    const nota = intToEstrelinhas(document.querySelector('input[name="rating"]:checked')?.value);

    return {
        titulo: titulo,
        reviewText: reviewText,
        nome: nome,
        destino: destino,
        nota: nota,
    }
}

function criarCardReview(review){
    cardReview = document.createElement('div');
    cardReview.className = 'review-card';

    cardReview.innerHTML =`
    <h2>“${review.titulo}”</h2>
        <p class="review-text">${review.reviewText}</p>
        <a href="#">Ver mais...</a>
        <div class="stars">${review.nota}</div>
        <div class="reviewer">
          <strong>${review.nome}</strong>
          <span>${review.destino}</span>
        </div>
        <img src="${geradorImagem()}" alt="Imagem submetida por cliente" />
    `;

    return cardReview;
}

function addCardReviewToReviewContainer(cardReview){
    const reviewContainer = document.getElementById('reviews-container');
    reviewContainer.appendChild(cardReview);

}

function intToEstrelinhas(reviewNota){
    const nota = parseInt(reviewNota);
    switch(nota){
        case 1:
            return "★";
        case 2:
            return "★★";
        case 3:
            return "★★★";
        case 4:
            return "★★★★";
        case 5:
            return "★★★★★";
        default:
            return "★★★★★";
    }
}

function geradorImagem(){
    const imagem = `https://picsum.photos/400/300?random=${Math.floor(Math.random()*1000)}`;

    return imagem;
}