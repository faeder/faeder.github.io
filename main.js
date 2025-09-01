import { intro } from './intro.js';
import { portfolio } from './portfolio.js';

document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const form   = document.getElementById('cmdline');
    const input  = document.getElementById('input');


    function print(line = "") {
        screen.innerHTML += line + "\n";
        screen.scrollTop = screen.scrollHeight;
    }

function typeBlock(lines, lineDelay = 200, charDelay = 20, overlap = true) {
    // if a single string (like backtick paragraph) is passed, split into array
    if (typeof lines === `string`) {
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

            // create a new div for each line
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
        typeBlock([
        "______________________________________________________________________",
        "      ________  ________  ________   _______  ________  ________  ",
        "     ╱        ╲╱        ╲╱        ╲_╱       ╲╱        ╲╱        ╲ ",
        "    ╱       __╱    _    ╱    _    ╱    _ /  ╱    _    ╱    _    ╱ ",
        "   ╱        _╱         ╱        _╱   /     /        _/        _/  ",
        "   ╲_______╱ ╲___╱____╱╲________╱╲________╱╲________╱╲____╱___╱   ",
        " _____________________________________________________________________",
        " Frédéric Gagnon-Girard ⛇        frederic.gagnongirard@gmail.com ⏍",
        " Montréal, Canada ⚑                             github.com/faeder ⚛",
        " ---------------------------------------------------------------------",
        ])

    }
    

    const commands = {
        help()  { typeBlock([
            " ",
            "Available commands: help, about, clear, portfolio"]); },
        about() {
            typeBlock([intro],200,0,true); },
        portfolio() {
            typeBlock([portfolio],200,0,true); },
        clear() { 
            screen.innerHTML = ""; 
            screen.scrollTop = 0;
            greeting();},
        date()  { typeBlock([new Date().toString()]); },
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = input.value;
        const cmd = raw.trim().toLowerCase();
        print("> " + raw);

        if (cmd in commands) {
            commands[cmd]();
        } else if (cmd.length) {
            print("Unknown command: " + raw);
        }
        input.value = "";
    });

    // show greeting on page load
    greeting();
});

