import { BlockType } from "./blockType.js";

export class Block {
    constructor() {
        this.type = BlockType.Default;
        this.isActive = true;
    }
}