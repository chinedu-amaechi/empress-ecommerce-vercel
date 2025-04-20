// src/components/ui/fonts.js


// Import Google Fonts
import {
  Josefin_Sans,
  Inter,
} from "next/font/google";

// Define multiple fonts for easy switching
// Note:
// (Some fonts require an explicit weight specification as they support multiple weights.)
  export const _1 = Josefin_Sans({ subsets: ["latin"], weight: "400" }); // Default
  export const _2 = Inter({ subsets: ["latin"], weight: "400" });

// Change the active font here
export const activeFont = _1;
