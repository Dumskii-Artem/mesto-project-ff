// @todo: Темплейт карточки
const placesList = document.querySelector('.places__list');

// @todo: DOM узлы
const cardTemplate = document.querySelector('#card-template').content; 
const elementForClone = cardTemplate.querySelector('.places__item');

// @todo: Функция создания карточки
function appendCard(card_init, del_function) {
    const cardElement = elementForClone.cloneNode(true);
    cardElement.querySelector('.card__title').textContent = card_init.name;
    cardElement.querySelector('.card__image').src = card_init.link;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', del_function);
    placesList.append(cardElement);
    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard() {
    const listItem = this.closest('.card');
    listItem.remove()    
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (card_init) {
    appendCard(card_init, deleteCard);
});