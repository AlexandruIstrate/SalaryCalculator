import { countries } from "countries-list";

function FlagDisplay({ countryCode, text = null }) {
    // Get the flag emoji
    const flagEmoji = countries[countryCode].emoji;

    // Return the HTML code
    return (
        <span>
            {/* Display the flag emoji */}
            <span className="flag-emoji">{flagEmoji}</span>

            {/* Only display the additional text if we have it */}
            { text ? <span className="flag-add-text">{text}</span> : null }
        </span>
    );
}

export default FlagDisplay;