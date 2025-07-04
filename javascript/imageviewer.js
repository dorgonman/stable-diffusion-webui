// A full size 'lightbox' preview modal shown when left clicking on gallery previews
function closeModal() {
    gradioApp().getElementById("lightboxModal").style.display = "none";
}

function showModal(event) {
    const source = event.target || event.srcElement;
    const modalImage = gradioApp().getElementById("modalImage");
    const modalToggleLivePreviewBtn = gradioApp().getElementById("modal_toggle_live_preview");
    modalToggleLivePreviewBtn.innerHTML = opts.js_live_preview_in_modal_lightbox ? "&#x1F5C7;" : "&#x1F5C6;";
    const lb = gradioApp().getElementById("lightboxModal");
    modalImage.src = source.src;
    if (modalImage.style.display === 'none') {
        lb.style.setProperty('background-image', 'url(' + source.src + ')');
    }
    updateModalImage();
    lb.style.display = "flex";
    lb.focus();

    const tabTxt2Img = gradioApp().getElementById("tab_txt2img");
    const tabImg2Img = gradioApp().getElementById("tab_img2img");
    // show the save button in modal only on txt2img or img2img tabs
    if (tabTxt2Img.style.display != "none" || tabImg2Img.style.display != "none") {
        gradioApp().getElementById("modal_save").style.display = "inline";
    } else {
        gradioApp().getElementById("modal_save").style.display = "none";
    }
    event.stopPropagation();
}

function negmod(n, m) {
    return ((n % m) + m) % m;
}

function updateModalImage() {
    const modalImage = gradioApp().getElementById("modalImage");
    let currentButton = selected_gallery_button();
    let preview = gradioApp().querySelectorAll('.livePreview > img');
    if (opts.js_live_preview_in_modal_lightbox && preview.length > 0) {
        // show preview image if available
        modalImage.src = preview[preview.length - 1].src;
    } else if (currentButton?.children?.length > 0 && modalImage.src != currentButton.children[0].src) {
        modalImage.src = currentButton.children[0].src;
        if (modalImage.style.display === 'none') {
            const modal = gradioApp().getElementById("lightboxModal");
            modal.style.setProperty('background-image', `url(${modalImage.src})`);
        }
    }
}

function updateOnBackgroundChange() {
    const modalImage = gradioApp().getElementById("modalImage");
    if (modalImage && modalImage.offsetParent) {
        updateModalImage();
    }
}
const updateModalImageIfVisible = updateOnBackgroundChange;

function modalImageSwitch(offset) {
    var galleryButtons = all_gallery_buttons();

    if (galleryButtons.length > 1) {
        var result = selected_gallery_index();

        if (result != -1) {
            var nextButton = galleryButtons[negmod((result + offset), galleryButtons.length)];
            nextButton.click();
            const modalImage = gradioApp().getElementById("modalImage");
            const modal = gradioApp().getElementById("lightboxModal");
            modalImage.src = nextButton.children[0].src;
            if (modalImage.style.display === 'none') {
                modal.style.setProperty('background-image', `url(${modalImage.src})`);
            }
            setTimeout(function() {
                modal.focus();
            }, 10);
        }
    }
}

function saveImage() {
    const tabTxt2Img = gradioApp().getElementById("tab_txt2img");
    const tabImg2Img = gradioApp().getElementById("tab_img2img");
    const saveTxt2Img = "save_txt2img";
    const saveImg2Img = "save_img2img";
    if (tabTxt2Img.style.display != "none") {
        gradioApp().getElementById(saveTxt2Img).click();
    } else if (tabImg2Img.style.display != "none") {
        gradioApp().getElementById(saveImg2Img).click();
    } else {
        console.error("missing implementation for saving modal of this type");
    }
}

function modalSaveImage(event) {
    saveImage();
    event.stopPropagation();
}

function modalNextImage(event) {
    modalImageSwitch(1);
    event.stopPropagation();
}

function modalPrevImage(event) {
    modalImageSwitch(-1);
    event.stopPropagation();
}

function modalKeyHandler(event) {
    switch (event.key) {
    case "s":
        saveImage();
        break;
    case "ArrowLeft":
        modalPrevImage(event);
        break;
    case "ArrowRight":
        modalNextImage(event);
        break;
    case "Escape":
        closeModal();
        break;
    }
}

function setupImageForLightbox(e) {
    if (e.dataset.modded) {
        return;
    }

    e.dataset.modded = true;
    e.style.cursor = 'pointer';
    e.style.userSelect = 'none';

    e.addEventListener('mousedown', function(evt) {
        if (evt.button == 1) {
            open(evt.target.src);
            evt.preventDefault();
            return;
        }
    }, true);

    e.addEventListener('click', function(evt) {
        if (!opts.js_modal_lightbox || evt.button != 0) return;

        modalZoomSet(gradioApp().getElementById('modalImage'), opts.js_modal_lightbox_initially_zoomed);
        evt.preventDefault();
        showModal(evt);
    }, true);

}

function modalZoomSet(modalImage, enable) {
    if (modalImage) modalImage.classList.toggle('modalImageFullscreen', !!enable);
}

function modalZoomToggle(event) {
    var modalImage = gradioApp().getElementById("modalImage");
    modalZoomSet(modalImage, !modalImage.classList.contains('modalImageFullscreen'));
    event.stopPropagation();
}

function modalLivePreviewToggle(event) {
    const modalToggleLivePreview = gradioApp().getElementById("modal_toggle_live_preview");
    opts.js_live_preview_in_modal_lightbox = !opts.js_live_preview_in_modal_lightbox;
    modalToggleLivePreview.innerHTML = opts.js_live_preview_in_modal_lightbox ? "&#x1F5C7;" : "&#x1F5C6;";
    updateModalImageIfVisible();
    event.stopPropagation();
}

function modalTileImageToggle(event) {
    const modalImage = gradioApp().getElementById("modalImage");
    const modal = gradioApp().getElementById("lightboxModal");
    const isTiling = modalImage.style.display === 'none';
    if (isTiling) {
        modalImage.style.display = 'block';
        modal.style.setProperty('background-image', 'none');
    } else {
        modalImage.style.display = 'none';
        modal.style.setProperty('background-image', `url(${modalImage.src})`);
    }

    event.stopPropagation();
}

onAfterUiUpdate(function() {
    var fullImg_preview = gradioApp().querySelectorAll('.gradio-gallery > div > img');
    if (fullImg_preview != null) {
        fullImg_preview.forEach(setupImageForLightbox);
    }
    updateOnBackgroundChange();
});

document.addEventListener("DOMContentLoaded", function() {
    //const modalFragment = document.createDocumentFragment();
    const modal = document.createElement('div');
    modal.onclick = closeModal;
    modal.id = "lightboxModal";
    modal.tabIndex = 0;
    modal.addEventListener('keydown', modalKeyHandler, true);

    const modalControls = document.createElement('div');
    modalControls.className = 'modalControls gradio-container';
    modal.append(modalControls);

    const modalZoom = document.createElement('span');
    modalZoom.className = 'modalZoom cursor';
    modalZoom.innerHTML = '&#10529;';
    modalZoom.addEventListener('click', modalZoomToggle, true);
    modalZoom.title = "Toggle zoomed view";
    modalControls.appendChild(modalZoom);

    const modalTileImage = document.createElement('span');
    modalTileImage.className = 'modalTileImage cursor';
    modalTileImage.innerHTML = '&#8862;';
    modalTileImage.addEventListener('click', modalTileImageToggle, true);
    modalTileImage.title = "Preview tiling";
    modalControls.appendChild(modalTileImage);

    const modalSave = document.createElement("span");
    modalSave.className = "modalSave cursor";
    modalSave.id = "modal_save";
    modalSave.innerHTML = "&#x1F5AB;";
    modalSave.addEventListener("click", modalSaveImage, true);
    modalSave.title = "Save Image(s)";
    modalControls.appendChild(modalSave);

    const modalToggleLivePreview = document.createElement('span');
    modalToggleLivePreview.className = 'modalToggleLivePreview cursor';
    modalToggleLivePreview.id = "modal_toggle_live_preview";
    modalToggleLivePreview.innerHTML = "&#x1F5C6;";
    modalToggleLivePreview.onclick = modalLivePreviewToggle;
    modalToggleLivePreview.title = "Toggle live preview";
    modalControls.appendChild(modalToggleLivePreview);

    const modalClose = document.createElement('span');
    modalClose.className = 'modalClose cursor';
    modalClose.innerHTML = '&times;';
    modalClose.onclick = closeModal;
    modalClose.title = "Close image viewer";
    modalControls.appendChild(modalClose);

    const modalImage = document.createElement('img');
    modalImage.id = 'modalImage';
    modalImage.onclick = closeModal;
    modalImage.tabIndex = 0;
    modalImage.addEventListener('keydown', modalKeyHandler, true);
    modal.appendChild(modalImage);

    const modalPrev = document.createElement('a');
    modalPrev.className = 'modalPrev';
    modalPrev.innerHTML = '&#10094;';
    modalPrev.tabIndex = 0;
    modalPrev.addEventListener('click', modalPrevImage, true);
    modalPrev.addEventListener('keydown', modalKeyHandler, true);
    modal.appendChild(modalPrev);

    const modalNext = document.createElement('a');
    modalNext.className = 'modalNext';
    modalNext.innerHTML = '&#10095;';
    modalNext.tabIndex = 0;
    modalNext.addEventListener('click', modalNextImage, true);
    modalNext.addEventListener('keydown', modalKeyHandler, true);

    modal.appendChild(modalNext);

    try {
        gradioApp().appendChild(modal);
    } catch (e) {
        gradioApp().body.appendChild(modal);
    }

    document.body.appendChild(modal);

});
