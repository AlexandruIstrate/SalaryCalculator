// Gets a List of available themes
export const getThemes = (t) => {
    return {
        light: {
            id: "light",
            displayName: t("themes.light"),
            bsName: "light"
        },
        dark: {
            id: "dark",
            displayName: t("themes.dark"),
            bsName: "dark"
        },
        auto: {
            id: "auto",
            displayName: t("themes.auto"),
            bsName: null
        }
    }
}
