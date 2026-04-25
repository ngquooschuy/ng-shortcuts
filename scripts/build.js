const { execSync } = require("child_process");

const C = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m",
    bold: "\x1b[1m"
};

const c = (t, color) => C[color] + t + C.reset;

console.clear();

const start = Date.now();

console.log(c("┌──────────────────────────────────────┐", "gray"));
console.log(c("│   NGX-HOTKEYS // PROD BUILD SYSTEM   │", "cyan"));
console.log(c("└──────────────────────────────────────┘", "gray"));
console.log("");

console.log(c("[INIT]", "magenta"), "Booting compiler...");
console.log(c("[SCAN]", "magenta"), "Angular workspace detected");
console.log(c("[EXEC]", "magenta"), "Running production build...\n");

try {
    execSync(
        "ng build ngx-hotkeys --configuration production",
        { stdio: "inherit" }
    );

    const time = ((Date.now() - start) / 1000).toFixed(2);

    console.log("");
    console.log(c("┌──────────────────────────────────────┐", "gray"));
    console.log(c("│   BUILD STATUS: SUCCESS             │", "green"));
    console.log(c("└──────────────────────────────────────┘", "gray"));
    console.log(c("[DIST]", "cyan"), "dist/ngx-hotkeys");
    console.log(c("[TIME]", "cyan"), time + "s");
    console.log(c("[READY]", "green"), "Package ready for deploy");
    console.log("");

} catch (e) {
    console.log("");
    console.log(c("[FAIL]", "magenta"), "Build process terminated");
}