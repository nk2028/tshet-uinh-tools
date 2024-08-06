import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "purecss/build/pure-min.css";
import "./style.css";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
