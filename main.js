import { intro } from './intro.js';
import { portfolio0, portfolio1, portfolio1title, portfolio2, portfolio2title } from './portfolio1.js';
import { greetingArt } from './greeting.js';


document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const form   = document.getElementById('cmdline');
    const input  = document.getElementById('input');

    // ----- STATE -----
    const state = {
        mode: "root",   // "root" or "portfolio"
        history: [],    // past commands
        historyIndex: -1
    };

    // ----- HELPERS -----
    function print(line = "") {
        screen.innerHTML += line + "\n";
        screen.scrollTop = screen.scrollHeight;
    }

    function typeBlock(lines, lineDelay = 200, charDelay = 20, overlap = true) {
        if (typeof lines === "string") {
            lines = lines.trim().split("\n");
        }

        return new Promise((resolve) => {
            let lineIndex = 0;

            function typeLine(line, lineDiv) {
                return new Promise((lineResolve) => {
                    let charIndex = 0;
                    const interval = setInterval(() => {
                        lineDiv.textContent += line[charIndex];
                        screen.scrollTop = screen.scrollHeight;
                        charIndex++;
                        if (charIndex >= line.length) {
                            clearInterval(interval);
                            lineResolve();
                        }
                    }, charDelay);
                });
            }

            function nextLine() {
                if (lineIndex >= lines.length) {
                    resolve();
                    return;
                }

                const currentLine = lines[lineIndex];
                lineIndex++;

                const lineDiv = document.createElement('div');
                screen.appendChild(lineDiv);

                lineDiv.style.transform = `rotateX(${lineIndex * 0.9}deg)`;
                lineDiv.style.transformOrigin = 'center top';

                const linePromise = typeLine(currentLine, lineDiv);

                if (overlap) {
                    setTimeout(nextLine, lineDelay);
                } else {
                    linePromise.then(() => setTimeout(nextLine, lineDelay));
                }
            }

            nextLine();
        });
    }

function greeting() {
    typeBlock(greetingArt, 0, 20, true); 
};


    

    function invalidCommand(raw) {
        print("Unknown command: " + raw);
    }

    // ----- COMMAND REGISTRY -----
    const commands = {
        help: {
            description: "List available commands",
            run: () => {
                typeBlock([
                    " ",
                    "Available commands:",
                    ...Object.keys(commands).map(cmd => `- ${cmd}: ${commands[cmd].description}`)
                ]);
            }
        },

        about: {
            description: "Show about info",
            run: () => typeBlock([intro], 200, 0, true)
        },

        portfolio: {
            description: "View portfolio entries",
            run: () => {
                state.mode = "portfolio";
                typeBlock([
                    portfolio0.trim(),
                    " ",
                    portfolio1title.trim(),
                    portfolio2title.trim(),
                    " ",
                    "Type 1 or 2 to see details, or 'clear' to reset."
                ], 200, 0, true);
            }
        },

        "1": {
            description: "Show portfolio entry 1 (only inside portfolio)",
            run: () => {
                if (state.mode !== "portfolio") {
                    invalidCommand("1");
                } else {
                    typeBlock([portfolio1], 200, 0, true);
                }
            }
        },

        "2": {
            description: "Show portfolio entry 2 (only inside portfolio)",
            run: () => {
                if (state.mode !== "portfolio") {
                    invalidCommand("2");
                } else {
                    typeBlock([portfolio2], 200, 0, true);
                }
            }
        },

        clear: {
            description: "Clear the screen",
            run: () => {
                screen.innerHTML = "";
                screen.scrollTop = 0;
                state.mode = "root";
                greeting();
            }
        },

        date: {
            description: "Show current date",
            run: () => typeBlock([new Date().toString()])
        }
    };

    // ----- INPUT HANDLER -----
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = input.value;
        const cmd = raw.trim().toLowerCase();
        print("> " + raw);

        // store history
        if (raw.trim()) {
            state.history.push(raw);
            state.historyIndex = state.history.length; // reset to "after last"
        }

        if (commands[cmd]) {
            commands[cmd].run();
        } else if (cmd.length) {
            invalidCommand(raw);
        }

        input.value = "";
    });

    // ----- HISTORY NAVIGATION -----
    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            if (state.historyIndex > 0) {
                state.historyIndex--;
                input.value = state.history[state.historyIndex];
            }
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                input.value = state.history[state.historyIndex];
            } else {
                state.historyIndex = state.history.length;
                input.value = "";
            }
            e.preventDefault();
        }
    });

    // ----- INIT -----
    greeting();
});
