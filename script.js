const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
filterValue = document.querySelector(".filter-info .value"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
saveImgBtn = document.querySelector(".save-img"),
importImgBtn = document.querySelector(".import-img");

// By default brightness & saturation value will be 100
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;

let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) 
  grayscale(${grayscale}%)`;
}

const loadImage = () => {
    // getting user selected file
    let file = fileInput.files[0]
    // return if user has not selected the file
    if (!file) return;
    // passing file url as preview img src
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
    // clicking reset btn, so the filter value reset if the user select new img
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    //adding click event listener to all filter buttons
    option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
        filterSlider.max = "200";
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
        filterSlider.max = "200";
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
        filterSlider.max = "100";
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
    } else {
        filterSlider.max = "100";
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
    }
    });
});


const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    // getting selected filter btn
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
    } else {
    grayscale = filterSlider.value
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    // Adding click event to all rotate/flip buttons
    option.addEventListener("click", () => {
    if (option.id === "left") {
        // If clicked btn is left rotate a decrement value of 90
        rotate -= 90;
    } else if (option.id === "right") {
        // If clicked btn is right rotate a increment value of 90
        rotate += 90;
    } else if (option.id === "horizontal") {
        // if flipHorizontal value is 1, set this value to -1 else set the value to be 1
        flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
        // if flipVertical value is 1, set this value to -1 else set the value to be 1
        flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
    });
});

const resetFilter = () => {
    // resetting all variables values to their default values 
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;

    rotate = 0; flipHorizontal = 1; flipVertical = 1;

    // clicking the brightness button hence brightness is selected by default
    filterOptions[0].click();

    applyFilters();
}

const saveImage = () => {
    // creating canvas element
    const canvas = document.createElement("canvas");
    // canvas.getcontext retrn a drawing cotext to the canvas
    const ctx = canvas.getContext("2d");
    // setting canvas width to actual image width
    canvas.width = previewImg.naturalWidth;
    // setting canvas height to actual image height
    canvas.height = previewImg.naturalHeight;

    // applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) 
    grayscale(${grayscale}%)`;
    // translating canvas from the center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // if rotate value is not 0, rotate the canvas
    if (rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180);
    }
    // flip canvas horizontally / vertically
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2);

    // creating <a> element
    const link = document.createElement("a");
    // passing <a> tag download vale to "image.jpg"
    link.download = "image.jpg";
    // passing <a. tag href value to canvas data url
    link.href = canvas.toDataURL();
    // on clicking the download link <a> directs you to the image itself
    link.click();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
importImgBtn.addEventListener("click", () => fileInput.click());