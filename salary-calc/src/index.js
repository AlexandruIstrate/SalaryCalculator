// Library imports
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

// Add Bootstrap to the app
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css"

// Local imports
import "src/index.css";
import App from "src/App";
import reportWebVitals from "src/reportWebVitals";
import { ThemeProvider } from "src/themes/ThemeContext";

// Add i18n to the app
import "src/i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <React.Suspense>
            <HashRouter>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </HashRouter>
        </React.Suspense>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
