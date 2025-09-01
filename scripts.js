(function () {
    const screen = document.getElementById('screen');
    const form   = document.getElementById('cmdline');
    const input  = document.getElementById('input');

    function print(line = "") {
        screen.innerHTML += line + "\n";
        screen.scrollTop = screen.scrollHeight;
    }

    function greeting() {
        print("______________________________________________________________");
        print("   ________  ________  ________   _______  ________  ________ ");
        print("  ╱        ╲╱        ╲╱        ╲_╱       ╲╱        ╲╱        ╲");
        print(" ╱       __╱    _    ╱    _    ╱    _ /  ╱    _    ╱    _    ╱");
        print("╱        _╱         ╱        _╱   /     /        _/        _/ ");
        print("╲_______╱ ╲___╱____╱╲________╱╲________╱╲________╱╲____╱___╱  ");
        print("______________________________________________________________");
        print("frédéric gagnon-girard         frederic.gagnongirard@gmail.com");
        };

    const commands = {
        help()  { print("Available commands: help, about, clear, date"); },
        about() { print("This is my interactive resume console."); },
        clear() { screen.innerHTML = ""; greeting()},
        date()  { print(new Date().toString()); },
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = input.value;
        const cmd = raw.trim().toLowerCase(); // <- handles spaces/case
        print("> " + raw);

        if (cmd in commands) {
        commands[cmd]();
        } else if (cmd.length) {
        print("Unknown command: " + raw);
        }
        input.value = "";
    });

      // optional greeting
    greeting();
    

})
