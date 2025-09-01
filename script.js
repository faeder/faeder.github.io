document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const form   = document.getElementById('cmdline');
    const input  = document.getElementById('input');

    function print(line = "") {
        screen.innerHTML += line + "\n";
        screen.scrollTop = screen.scrollHeight;
    }

function typeBlock(lines, lineDelay = 100, charDelay = 10, overlap = true) {
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
                // start next line after lineDelay ms even if this one isn't finished
                setTimeout(nextLine, lineDelay);
            } else {
                // wait for this line to finish then lineDelay
                linePromise.then(() => setTimeout(nextLine, lineDelay));
            }
        }

        nextLine();
    });
}



    function greeting() {
        typeBlock([
        "______________________________________________________________",
        "   ________  ________  ________   _______  ________  ________ ",
        "  ╱        ╲╱        ╲╱        ╲_╱       ╲╱        ╲╱        ╲",
        " ╱       __╱    _    ╱    _    ╱    _ /  ╱    _    ╱    _    ╱",
        "╱        _╱         ╱        _╱   /     /        _/        _/ ",
        "╲_______╱ ╲___╱____╱╲________╱╲________╱╲________╱╲____╱___╱  ",
        "______________________________________________________________",
        "frédéric gagnon-girard         frederic.gagnongirard@gmail.com",
        new Date().toGMTString(),
        ], 200, 20, true);

        // for (let i = 0; i < 2; i++) {
        //     print("\n")}
        }
    

    const commands = {
        help()  { typeBlock(["Available commands: help, about, clear, date"]); },
        about() { typeBlock(["This is my interactive resume console."]); },
        clear() { screen.innerHTML = ""; greeting(); },
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
