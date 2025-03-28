import "../pages/index.css";
import { initialCards } from "../components/cards";
import { closePopup, openPopup } from "../components/modal";
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

const imagePopup =   document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// показать все карточки
initialCards.forEach(function (cardInit) {
    renderCard(cardInit, openCardPopup, "append");
});

const addButton =  document.querySelector('.profile__add-button');
const addPopup =   document.querySelector('.popup_type_new-card');
addButton.addEventListener('click', () => openPopup(addPopup, null));

const editButton =  document.querySelector('.profile__edit-button');
const editPopup =   document.querySelector('.popup_type_edit');
editButton.addEventListener('click', () => openPopup(editPopup, beforeEditPopupOpened));

function beforeEditPopupOpened() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
}

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value; 
    closePopup(editPopup);
}

formEditProfile.addEventListener('submit', handleEditFormSubmit); 


function handleNewPlaceFormSubmit(evt) {
    evt.preventDefault();

    const newCard = {};
    newCard.name = cardNameInput.value;
    newCard.link =  urlInput.value
    // по умолчанию, добавляет в начало списка
    renderCard(newCard);

    cardNameInput.value = '';
    urlInput.value = '';

    closePopup(addPopup);
}

formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit); 

function openCardPopup( title, link) {
    popupImage.src = link;
    popupImage.alt = title;
    popupCaption.textContent = title;

    openPopup(imagePopup, null);
}
