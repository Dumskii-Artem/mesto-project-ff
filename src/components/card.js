// Card.js
import { API_setLikeCard, secretConfig } from '../scripts/api.js';

export { createCard };

const cardTemplate = document.querySelector('#card-template').content; 
const elementForClone = cardTemplate.querySelector('.places__item');

function likeCard({ likeButton, likeCountElement, cardId, isLiked }) {
    API_setLikeCard(secretConfig, cardId, isLiked)
        .then(updatedCard => {
            likeCountElement.textContent = updatedCard.likes.length;
            likeButton.classList.toggle("card__like-button_is-active");
        })
        .catch(err => {
            console.error('Ошибка лайка:', err);
        });
}

function createCard({
    cardObject,
    deleteFunction,
    onCardClickFunction,
//    likeCard,
    canDelete,
    isLiked
}) {
    const cardElement = elementForClone.cloneNode(true);
    cardElement.querySelector('.card__title').textContent = cardObject.name;

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = cardObject.link;
    cardImage.alt = cardObject.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeCountElement = cardElement.querySelector('.card__like-count');
    const likeButton = cardElement.querySelector('.card__like-button');

    likeCountElement.textContent = cardObject.likes.length;
    if (isLiked) {
        likeButton.classList.add("card__like-button_is-active");
    }

    if (canDelete) {
        deleteButton.addEventListener('click', (event) => {
            deleteFunction(event.target, cardObject._id);
        });
    } else {
        deleteButton.style.visibility = 'hidden';
    }

    likeButton.addEventListener('click', () => {
        likeCard({
            likeButton,
            likeCountElement,
            cardId: cardObject._id,
            isLiked: likeButton.classList.contains("card__like-button_is-active")
        });
    });

    cardImage.addEventListener('click', () =>
        onCardClickFunction(cardObject.name, cardObject.link)
    );

    return cardElement;
}
