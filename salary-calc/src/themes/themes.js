// Define the themes
export const lightTheme = {
    bsTheme: "light",
    bsBackground: "bg-light",
    countrySelStyle: {}
};

export const darkTheme = {
    bsTheme: "dark",
    bsBackground: "bg-dark",
    countrySelStyle: {
        container: (provided) => ({
            ...provided,
            backgroundColor: "#212529", // Set the background color for the entire Select container
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: "#212529", // Set the background color for the control
            borderColor: "#495057", // Set the border color
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#ffffff", // Set the text color for the selected value
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#0d6efd" : (state.isFocused ? "#2b3035" : "#212529"), // Set the background color for each option
            color: state.isSelected ? "#ffffff" : "#cccccc", // Set the text color for each option
        }),
        // Set the border of the open menu as a white gradient
        menu: (provided) => ({
            ...provided,
            border: "1px solid transparent",
            boxShadow: "0 5px 30px rgba(0, 0, 0, 1)",
            backgroundColor: "#212529"
        }),
    }
};

export const getThemeOptions = (t) => {
    return {
        light: {
            id: "light",
            displayName: t("themes.light")
        },
        dark: {
            id: "dark",
            displayName: t("themes.dark")
        },
        auto: {
            id: "auto",
            displayName: t("themes.auto")
        }
    };
}
