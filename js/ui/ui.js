import { GetCookie, SetCookie } from "../cookies.js";

function CheckCookies() {
    let volume = GetCookie("volume");
    if(volume == "") {
        SetCookie("volume", 70, 365);
    } else {
        volumeSlider.value = volume;
    }
    
    let renderDistance = GetCookie("renderDistance");
    if(renderDistance == "") {
        SetCookie("renderDistance", 4, 365);
    } else {
        renderDistanceSlider.value = renderDistance;
    }
}

let volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", function () {
    volumeValue.innerHTML = volumeSlider.value + '%';
    SetCookie("volume", volumeSlider.value, 365);
});

let renderDistanceSlider = document.getElementById("renderDistanceSlider");
renderDistanceSlider.addEventListener("input", function () {
    renderDistanceValue.innerHTML = renderDistanceSlider.value;
    SetCookie("renderDistance", renderDistanceSlider.value, 365);
});

CheckCookies();

let volumeValue = document.getElementById("volumeValue");
let renderDistanceValue = document.getElementById("renderDistanceValue");

volumeValue.innerHTML = volumeSlider.value + '%';
volumeValue.style.textShadow = '-0.75px 0.75px 0 #FFF, 0.75px 0.75px 0 #FFF, 0.75px -0.75px 0 #FFF, -0.75px -0.75px 0 #FFF';

renderDistanceValue.innerHTML = renderDistanceSlider.value;
renderDistanceValue.style.textShadow = '-0.75px 0.75px 0 #FFF, 0.75px 0.75px 0 #FFF, 0.75px -0.75px 0 #FFF, -0.75px -0.75px 0 #FFF';