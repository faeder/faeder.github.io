import { intro } from './intro.js';
import { portfolio0, portfolio1, portfolio1title, portfolio2, portfolio2title } from './portfolio1.js';
import { greetingArt } from './greeting.js';

let insideportfolio = false;

document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const form   = document.getElementById('cmdline');
    const input  = document.getElementById('input');

    // -------------------------
    // UTILITIES
    // -------------------------
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
    }

    function invalidCommand(raw) {
        print("Unknown command: " + raw);
    }

    // -------------------------
    // DYNAMIC HELP
    // -------------------------
    function getAvailableCommands() {
        const baseCommands = ["help", "about", "clear", "portfolio", "date"];
        const portfolioCommands = ["1", "2"];
        return insideportfolio ? baseCommands.concat(portfolioCommands) : baseCommands;
    }

    // -------------------------
    // COMMANDS
    // -------------------------
    const commands = {
        help() {
            const available = getAvailableCommands();
            typeBlock([
                " ",
                "Available commands: " + available.join(", ")
            ]);
        },

        about() {
            typeBlock([intro], 200, 0, true);
        },

        portfolio() {
            insideportfolio = true;
            typeBlock([
                portfolio0.trim(),
                " ",
                portfolio1title.trim(),
                portfolio2title.trim(),
                " ",
                "Type the entry number for which you want to have detail."
            ], 200, 0, true);
        },

        "1"() {
            if (!insideportfolio) {
                invalidCommand("1");
            } else {
                typeBlock([portfolio1], 200, 0, true);
            }
        },

        "2"() {
            if (!insideportfolio) {
                invalidCommand("2");
            } else {
                typeBlock([portfolio2], 200, 0, true);
            }
        },

        clear() {
            insideportfolio = false; // reset state
            screen.innerHTML = "";
            screen.scrollTop = 0;
            greeting();
        },

        date() {
            typeBlock([new Date().toString()]);
        }
    };

    // -------------------------
    // INPUT HANDLER
    // -------------------------
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = input.value;
        const cmd = raw.trim().toLowerCase();
        print("> " + raw);

        if (cmd in commands) {
            commands[cmd]();
        } else if (cmd.length) {
            invalidCommand(raw);
        }
        input.value = "";
    });

    // -------------------------
    // INITIAL GREETING
    // -------------------------
    greeting();
});
