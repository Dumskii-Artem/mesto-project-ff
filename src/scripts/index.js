import "../pages/index.css";
import { closePopup, openPopup, setModalWindowEventListeners } from "../components/modal";
import { createCard } from "../components/card";
import {enableValidation, clearValidation} from './validation.js';
import {
    API_addOneMoreCard, 
    API_changeUserInfo, 
    API_deleteCard, 
    API_getUsersMe, 
    API_getCards, 
 //   API_setLikeCard,
    API_setAvatar,
    secretConfig
} from './api.js';

let userMe;

// EDIT PROFILE
const formEditProfile = document.querySelector('[name="edit-profile"]')
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const descriptionInput = formEditProfile.querySelector('.popup__input_type_description');

const profileImage = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const changeAvatarPopup = document.querySelector('.popup_type_change-avatar');
const changeAvatarForm = changeAvatarPopup.querySelector('form');
const avatarNewURLInput = changeAvatarPopup.querySelector('[name="new-avatar-url"]');

// PLACES
const formNewPlace = document.querySelector('[name="new-place"]')
const cardNameInput = formNewPlace.querySelector('[name="new-place-name"]');
const cardNewURLInput = formNewPlace.querySelector('[name="new-card-url"]');


const imagePopup =   document.querySelector('.popup_type_image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const deleteCardPopup = document.querySelector('.popup_type_delete-card');
//const confirmCardDeleteButton = document.querySelector('#confirm-card-delete');
const deleteCardForm = document.querySelector('[name="delete-card"]')

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
//const editProfileForm = document.forms['edit-profile'];

const popUps = document.querySelectorAll(".popup");

function beforeChangeAvatarPopupOpened() {
    avatarNewURLInput.value = 'https://';
    clearValidation(changeAvatarForm, validationConfig);
}

function beforeNewCardPopupOpened() {
    cardNameInput.value = '';
    cardNewURLInput.value = 'https://';
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
    imagePopupImage.src = link;
    imagePopupImage.alt = title;
    imagePopupCaption.textContent = title;

    openPopup(imagePopup, null);
}

function handleNewPlaceFormSubmit(evt) {
    evt.preventDefault();

    const newName = cardNameInput.value;
    const newLink = cardNewURLInput.value;

    API_addOneMoreCard(secretConfig, newName, newLink)
        .then(newCardFromServer => {
            renderCard({ cardObject: newCardFromServer }); // используем то, что вернул сервер
        })
        .catch(err => {
            console.error("Ошибка при добавлении карточки:", err);
        })
        .finally (() => {
            formNewPlace.reset();
            closePopup(addPopup);
        })

};

// function toggleLikeHandler({ cardId, isLiked }) {
//     API_setLikeCard(secretConfig, cardId, isLiked)

// }

function renderCard({ cardObject, canDelete = true, isLiked = false, method = "prepend" }) {
    placesList[method](
        createCard({
            cardObject,
            deleteFunction: deleteCard,
            onCardClickFunction: openCardPopup,
           // toggleLikeHandler, 
            canDelete,
            isLiked
        })
    );
}

function showProfile() {
    profileTitle.textContent = userMe.name;
    profileDescription.textContent = userMe.about;
    profileImage.style.backgroundImage = `url(${userMe.avatar})`;
};

// ********** API **********
// Читаем ждём два ответа и грузим данные из двух источников
Promise.all([API_getUsersMe(secretConfig), API_getCards(secretConfig)])
    .then(([user, cardsArray]) => {
        // копирую наружу -> public userMe
        userMe = user;
        showProfile();

        cardsArray.forEach(function (card) {
                const canDelete = (card.owner._id === userMe._id);
                const isLiked = card.likes.some(user => user._id === userMe._id);
                renderCard({
                    cardObject : card, 
                    canDelete: canDelete, 
                    isLiked: isLiked,
                    method : "append"
                });
            })
        })
    .catch((err) => {
        console.log(err);
    });

function submitDeleteCard(evt, cardElement, cardId) {
    evt.preventDefault();

    API_deleteCard(secretConfig, cardId)
        .then(() => {
            cardElement.remove();
        })
        .catch(err => {
            console.error('Ошибка при удалении карточки:', err);
        })
        .finally (() => {
            closePopup(deleteCardPopup);
        });
}

function deleteCard(delButton, cardId) {
    const cardElement = delButton.closest('.card');
    openPopup(deleteCardPopup, null);
    deleteCardForm.onsubmit = (evt) => submitDeleteCard(evt, cardElement, cardId);
}

profileImage.addEventListener('click', () => openPopup(changeAvatarPopup, beforeChangeAvatarPopupOpened));
    
addButton.addEventListener('click', () => openPopup(addPopup, beforeNewCardPopupOpened));
editButton.addEventListener('click', () => openPopup(editPopup, beforeEditPopupOpened));
formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit);

changeAvatarForm.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const input = changeAvatarForm.querySelector('#input_avatar-image');
    const newAvatarUrl = input.value;
  
    API_setAvatar(secretConfig, newAvatarUrl)
        .then((updatedUser) => {
            profileImage.style.backgroundImage = `url(${updatedUser.avatar})`;
        })
        .catch(err => {
            console.error('Ошибка при обновлении аватара:', err);
        })
        .finally (() => {
            changeAvatarForm.reset();
            closePopup(changeAvatarPopup);
        });
});

formEditProfile.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const newName = nameInput.value;
    const newJob = descriptionInput.value;
  
    API_changeUserInfo(secretConfig, newName, newJob)
        .then((data) => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
        })
        .catch((err) => {
            console.error('Ошибка при обновлении профиля:', err);
        })
        .finally (() => {
            closePopup(editPopup);
        });
});

popUps.forEach((ModalWidow) => {
    setModalWindowEventListeners(ModalWidow);

    const form = ModalWidow.querySelector(validationConfig.formSelector);
    if (form) {
        clearValidation(form, validationConfig);
    };
})

enableValidation(validationConfig);


