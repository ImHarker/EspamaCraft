export class Time {
    static deltaTime = 0.0;
    static time = 0.0;
    static lastTime = 0.0;

    static update() {
        this.time = performance.now() / 1000;
        this.deltaTime = this.time - this.lastTime;
        this.lastTime = this.time;
    }
}