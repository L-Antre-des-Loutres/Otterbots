import figlet from "figlet";

export function displayLogo(): void {
    console.log(
        figlet.textSync("Otterbots", {
            font: "Standard", // ou "Slant", "Big", "Ghost", etc.
            horizontalLayout: "default",
            verticalLayout: "default"
        })
    );

}

