const placesList = document.querySelector('.places__list');

const cardTemplate = document.querySelector('#card-template').content; 
const elementForClone = cardTemplate.querySelector('.places__item');

function createCard(cardInit, deleteFunction) {
    const cardElement = elementForClone.cloneNode(true);
    cardElement.querySelector('.card__title').textContent = cardInit.name;
    cardElement.querySelector('.card__image').src = cardInit.link;
    cardElement.querySelector('.card__image').alt = cardInit.name;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', deleteFunction);
    return cardElement;
}

function deleteCard() {
    const listItem = this.closest('.card');
    listItem.remove()    
}

function renderCard(item, method = "prepend") {
    placesList[ method ](createCard(item, deleteCard));
}



initialCards.forEach(function (cardInit) {
    renderCard(cardInit, "append");
});
