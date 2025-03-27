import { showPopup } from "./modal";

export {
    renderCard
};


const imagePopup =   document.querySelector('.popup_type_image');

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content; 
const elementForClone = cardTemplate.querySelector('.places__item');

function createCard(
    cardInit, 
    deleteFunction, 
    showPopupFunction, 
    likeFunction
) {
    const cardElement = elementForClone.cloneNode(true);
    cardElement.querySelector('.card__title').textContent = cardInit.name;
    cardElement.querySelector('.card__image').src = cardInit.link;
    cardElement.querySelector('.card__image').alt = cardInit.name;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteFunction(event.target);
    });

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        likeFunction(event.target);
    });

    cardElement.addEventListener('click', showPopupFunction);
    return cardElement;
}

function renderCard(item, method = "prepend") {
    placesList[ method ](createCard(
        item, 
        deleteCard, 
        showCardPopup,
        likeCard
    ));
}

function likeCard (likeButton) {
    likeButton.classList.toggle("card__like-button_is-active");
}

function deleteCard(delButton) {
    const listItem = delButton.closest('.card');
    listItem.remove()    
}

function showCardPopup() {
    const listItem = this.closest('.card');

    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');

    popupImage.src = listItem.querySelector('.card__image').src;
    popupImage.alt = listItem.querySelector('.card__image').alt;
    popupCaption.textContent = listItem.querySelector('.card__title').textContent;

//    showPopup(imagePopup);
    showPopup(imagePopup, null);
}