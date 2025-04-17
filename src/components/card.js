export { createCard };

const cardTemplate = document.querySelector('#card-template').content; 
const elementForClone = cardTemplate.querySelector('.places__item');

function createCard({
    cardInit, 
    deleteFunction, 
    onCardClickFunction, 
    likeFunction
    }
) {
    const cardElement = elementForClone.cloneNode(true);
    cardElement.querySelector('.card__title').textContent = cardInit.name;
    const cardImage = cardElement.querySelector('.card__image')
    cardImage.src = cardInit.link;
    cardImage.alt = cardInit.name;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', (event) => {
        deleteFunction(event.target);
    });

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', (event) => {
        likeFunction(event.target);
    });

    cardImage.addEventListener('click', () =>
        onCardClickFunction(cardInit.name, cardInit.link));
    return cardElement;
}







