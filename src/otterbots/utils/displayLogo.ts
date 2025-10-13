import figlet from "figlet";

export function displayLogo(name: string = "Otterbots"): void {
    console.log(
        figlet.textSync(name, {
            font: "Standard", // ou "Slant", "Big", "Ghost", etc.
            horizontalLayout: "default",
            verticalLayout: "default"
        })
    );
    console.log("\n✨  Made with 🦦 by Antre des Loutres ✨\n");

}

