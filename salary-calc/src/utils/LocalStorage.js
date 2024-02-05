// Export the class that handles local storage
export const LocalStorage = {
    // Salary
    get salary() {
        return window.localStorage.getItem("salary");
    },
    set salary(value) {
        window.localStorage.setItem("salary", value);
    },

    // Source Country
    get sourceCountry() {
        return window.localStorage.getItem("sourceCountry");
    },
    set sourceCountry(value) {
        window.localStorage.setItem("sourceCountry", value);
    },

    // Destination Country
    get destinationCountry() {
        return window.localStorage.getItem("destinationCountry");
    },
    set destinationCountry(value) {
        window.localStorage.setItem("destinationCountry", value);
    },

    // History
    get history() {
        return JSON.parse(window.localStorage.getItem("history"));
    },
    set history(value) {
        window.localStorage.setItem("history", JSON.stringify(value));
    },

    // Theme
    get theme() {
        return window.localStorage.getItem("theme");
    },
    set theme(value) {
        window.localStorage.setItem("theme", value);
    }
}
