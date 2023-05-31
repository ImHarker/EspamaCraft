import {
    BlockType
} from "./terrain/blockType.js";
import {
    aimController
} from "./app.js";

document.addEventListener('keydown', (event) => {
    if(event.key == "1") {
        aimController.placeBlockType = BlockType.Dirt;
        document.getElementById("hotbar1").classList.add("selected")
        document.getElementById("hotbar2").classList.remove("selected")
        document.getElementById("hotbar3").classList.remove("selected")
    }
    else if(event.key == "2") {
        aimController.placeBlockType = BlockType.OakLog;
        document.getElementById("hotbar2").classList.add("selected")
        document.getElementById("hotbar1").classList.remove("selected")
        document.getElementById("hotbar3").classList.remove("selected")
    }
    else if(event.key == "3") {
        aimController.placeBlockType = BlockType.Glowstone;
        document.getElementById("hotbar3").classList.add("selected")
        document.getElementById("hotbar1").classList.remove("selected")
        document.getElementById("hotbar2").classList.remove("selected")
    }
});