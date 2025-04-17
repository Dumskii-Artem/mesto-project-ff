import "../pages/index.css";
import { initialCards } from "../components/cards";
import { closePopup, openPopup, setModalWindowEventListeners } from "../components/modal";
import { createCard } from "../components/card";
import {enableValidation, clearValidation} from './validation.js';

// EDIT PROFILE
const formEditProfile = document.querySelector('[name="edit-profile"]')
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const descriptionInput = formEditProfile.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// PLACES
const formNewPlace = document.querySelector('[name="new-place"]')
const cardNameInput = formNewPlace.querySelector('.popup__input_type_card-name');
const urlInput = formNewPlace.querySelector('.popup__input_type_url');

const imagePopup =   document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const placesList = document.querySelector('.places__list');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
}



const addButton =  document.querySelector('.profile__add-button');
const addPopup =   document.querySelector('.popup_type_new-card');
const addForm = addPopup.querySelector('.popup__form');


const editButton =  document.querySelector('.profile__edit-button');
const editPopup =   document.querySelector('.popup_type_edit');

const popUps = document.querySelectorAll(".popup");



function beforeNewCardPopupOpened() {
    clearValidation(addForm, validationConfig);
}

function beforeEditPopupOpened() {
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig);
}

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value; 
    closePopup(editPopup);
}

formEditProfile.addEventListener('submit', handleEditFormSubmit); 

function openCardPopup( title, link) {
    popupImage.src = link;
    popupImage.alt = title;
    popupCaption.textContent = title;

    openPopup(imagePopup, null);
}

function handleNewPlaceFormSubmit(evt) {
    evt.preventDefault();

    let newCard = {};
    newCard.name = cardNameInput.value;
    newCard.link =  urlInput.value
    // по умолчанию, добавляет в начало списка
    renderCard(newCard);

    formNewPlace.reset();

    closePopup(addPopup);
}

function renderCard(item, method = "prepend") {
    placesList[ method ](
        createCard(
            {
                cardInit: item,
                deleteFunction : deleteCard,
                onCardClickFunction: openCardPopup,
                likeFunction: likeCard
            }
        )
    );
}

function likeCard (likeButton) {
    likeButton.classList.toggle("card__like-button_is-active");
}

function deleteCard(delButton) {
    const listItem = delButton.closest('.card');
    listItem.remove()    
}




// показать все карточки
initialCards.forEach(function (cardInit) {
    renderCard(cardInit, "append");
});

addButton.addEventListener('click', () => openPopup(addPopup, beforeNewCardPopupOpened));
editButton.addEventListener('click', () => openPopup(editPopup, beforeEditPopupOpened));
formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit); 

popUps.forEach((ModalWidow) => {
    setModalWindowEventListeners(ModalWidow);

    const form = ModalWidow.querySelector(validationConfig.formSelector);
    if (form) {
        clearValidation(form, validationConfig);
    };
})

enableValidation(validationConfig);

