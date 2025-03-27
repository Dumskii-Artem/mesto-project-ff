export {
    closePopup,
    setupCloseEvents,
    showPopup
};

function openPopup(popup) {
    popup.classList.add("popup_is-opened");
}

function closePopup() {
    const popup = this.closest('.popup');
    popup.classList.remove("popup_is-opened");
}

function setupCloseEvents() {
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("popup_is-opened")) {
            closePopup.call(event.target);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const openedPopup = document.querySelector(".popup_is-opened");
            if (openedPopup) closePopup.call(openedPopup);
        }
    });
}

function showPopup(popup, beforeFunction) {
    if (beforeFunction !== null) {
        beforeFunction();
    }
    openPopup(popup);
    const closeCross = popup.querySelector('.popup__close');
    closeCross.addEventListener('click', closePopup);
}

