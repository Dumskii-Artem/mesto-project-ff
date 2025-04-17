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
    API_setLikeCard,
    API_setAvatar
} from './api.js';

let userMe;

// EDIT PROFILE
const formEditProfile = document.querySelector('[name="edit-profile"]')
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const descriptionInput = formEditProfile.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const changeAvatarPopup = document.querySelector('.popup_type_change-avatar');
const changeAvatarForm = changeAvatarPopup.querySelector('form');

// PLACES
const formNewPlace = document.querySelector('[name="new-place"]')
const cardNameInput = formNewPlace.querySelector('.popup__input_type_card-name');
const urlInput = formNewPlace.querySelector('.popup__input_type_url');

const imagePopup =   document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const deleteCardPopup = document.querySelector('.popup_type_delete-card');
const confirmCardDeleteButton = document.querySelector('#confirm-card-delete');

const placesList = document.querySelector('.places__list');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
}

const secretConfig = {
    cohortUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-37',
    headers: {
    // сюда вставьте ваш токен из Yandex Practicum
      authorization: '861cc2f0-b98e-47f6-8920-32557f672b94',
      'Content-Type': 'application/json'
    }
};

const addButton =  document.querySelector('.profile__add-button');
const addPopup =   document.querySelector('.popup_type_new-card');
const addForm = addPopup.querySelector('.popup__form');


const editButton =  document.querySelector('.profile__edit-button');
const editPopup =   document.querySelector('.popup_type_edit');
const editProfileForm = document.forms['edit-profile'];

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

    const newName = cardNameInput.value;
    const newLink = urlInput.value;

    API_addOneMoreCard(secretConfig, newName, newLink)
        .then(newCardFromServer => {
            renderCard({ cardObject: newCardFromServer }); // используем то, что вернул сервер
            formNewPlace.reset();
            closePopup(addPopup);
        })
        .catch(err => {
            console.error("Ошибка при добавлении карточки:", err);
        });
}

function likeCard ({ likeButton, likeCountElement, cardId, isLiked }) {
    API_setLikeCard(secretConfig, cardId, isLiked)
        .then(updatedCard => {
            likeCountElement.textContent = updatedCard.likes.length;
            likeButton.classList.toggle("card__like-button_is-active");
        })
        .catch(err => {
            console.error('Ошибка лайка:', err);
        });
}

function renderCard({ cardObject, canDelete = true, isLiked = false, method = "prepend" }) {
    placesList[ method ](
        createCard(
            {
                cardObject: cardObject,
                deleteFunction : deleteCard,
                onCardClickFunction: openCardPopup,
                likeFunction: likeCard,
                canDelete: canDelete,
                isLiked : isLiked
            }
        )
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

// Это обработчик нажатия на корзинку на карточке
// обработчик кнопки в попапе находится внутри этой функции
// поэтому используются локальные card_id и cardElement
// Спасибо ChatGPT!!!
// думаю, я правильно понял, что тут происходит :)
function deleteCard(delButton, card_id) {
    const cardElement = delButton.closest('.card');

    openPopup(deleteCardPopup, () => {
        // Очищаем старые обработчики, чтобы не плодить их
        confirmCardDeleteButton.replaceWith(confirmCardDeleteButton.cloneNode(true));

        const freshConfirmButton = document.querySelector('#confirm-card-delete');

        freshConfirmButton.addEventListener('click', () => {
            API_deleteCard(secretConfig, card_id)
                .then(() => {
                    cardElement.remove();
                    closePopup(deleteCardPopup);
                })
                .catch(err => {
                    console.error('Ошибка при удалении карточки:', err);
                });
        });
    });
}

profileImage.addEventListener('click', () => openPopup(changeAvatarPopup, null));
    
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
        closePopup(changeAvatarPopup);
        changeAvatarForm.reset();
      })
      .catch(err => {
        console.error('Ошибка при обновлении аватара:', err);
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
        closePopup(editPopup);
      })
      .catch((err) => {
        console.error('Ошибка при обновлении профиля:', err);
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


