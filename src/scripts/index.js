import "../pages/index.css";
import { initialCards } from "../components/cards";
import { setupCloseEvents, showPopup, closePopup } from "../components/modal";
import { renderCard } from "../components/card";

// EDIT PROFILE
const formEditProfile = document.querySelector('[name="edit-profile"]')
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const jobInput = formEditProfile.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// PLACES
const formNewPlace = document.querySelector('[name="new-place"]')
const cardNameInput = formNewPlace.querySelector('.popup__input_type_card-name');
const urlInput = formNewPlace.querySelector('.popup__input_type_url');

// показать все карточки
initialCards.forEach(function (cardInit) {
    renderCard(cardInit, "append");
});

// настройки модальных окон
setupCloseEvents();

const addButton =  document.querySelector('.profile__add-button');
const addPopup =   document.querySelector('.popup_type_new-card');
addButton.addEventListener('click', () => showPopup(addPopup, null));

const editButton =  document.querySelector('.profile__edit-button');
const editPopup =   document.querySelector('.popup_type_edit');
editButton.addEventListener('click', () => showPopup(editPopup, beforeEditPopupOpened));

function beforeEditPopupOpened() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
}

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value; 
    closePopup.call(editPopup);
}

formEditProfile.addEventListener('submit', handleEditFormSubmit); 


function handleNewPlaceFormSubmit(evt) {
    evt.preventDefault();

    const newCard = {};
    newCard.name = cardNameInput.value;
    newCard.link =  urlInput.value
    // по умолчанию, добавляет в начало списка
    renderCard(newCard);

    closePopup.call(addPopup);
}

formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit); 

