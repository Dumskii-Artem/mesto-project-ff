export {
    closePopup,
    openPopup
};

export const setModalWindowEventListeners = (modalWindow) => {
    // 1. Добавить модификатор popup_is-animated модальному окну 
    modalWindow.classList.add("popup_is-animated");

    // 2. Добавить обработчик события click на кнопку закрытия
    const closeCross = modalWindow.querySelector('.popup__close');
    closeCross.addEventListener('click', () => {closePopup(modalWindow);});

    // 3. Добавить обработчик события для оверлея
    // click мимо окна
    modalWindow.addEventListener('click', (event) => { 
        if (!event.target.classList.contains(".popup__content")) {
            closePopup(event.target);
        }
    });
};

function openPopup(popup, beforeFunction) {
    if (beforeFunction !== null) {
        beforeFunction();
    }
    popup.classList.add("popup_is-opened");
    document.addEventListener("keydown", handleEscClose);
}

function closePopup(popup) {
    popup.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(event) {
    if (event.key === "Escape") {
        const openedPopup = document.querySelector(".popup_is-opened");
        if (openedPopup) closePopup(openedPopup);
    }
}



