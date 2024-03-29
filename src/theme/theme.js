import { extendTheme } from '@chakra-ui/react'

const colors = {
  "black": "#0f1010",
  "gray": {
    "50": "#f9fafa",
    "100": "#f1f1f2",
    "200": "#e7e7e8",
    "300": "#d3d4d5",
    "400": "#aaadaf",
    "500": "#7c7f83",
    "600": "#525558",
    "700": "#353739",
    "800": "#1f2021",
    "900": "#191a1a"
  },
  "orange": {
    "50": "#fffaf3",
    "100": "#ffeacf",
    "200": "#ffd195",
    "300": "#ffaa3b",
    "400": "#e88c15",
    "500": "#c87912",
    "600": "#a9660f",
    "700": "#87510c",
    "800": "#6a400a",
    "900": "#573508"
  },
  "yellow": {
    "50": "#fffef8",
    "100": "#fffad1",
    "200": "#fff066",
    "300": "#f7e116",
    "400": "#e2ce14",
    "500": "#baa911",
    "600": "#95870d",
    "700": "#746a0a",
    "800": "#574f08",
    "900": "#484106"
  },
  "green": {
    "50": "#effff8",
    "100": "#97ffd2",
    "200": "#16f493",
    "300": "#14d983",
    "400": "#11be73",
    "500": "#0fa363",
    "600": "#0c8752",
    "700": "#0a6940",
    "800": "#085634",
    "900": "#06472b"
  },
  "teal": {
    "50": "#e9feff",
    "100": "#94f8ff",
    "200": "#16ebf9",
    "300": "#14d1df",
    "400": "#11b2bd",
    "500": "#0f97a1",
    "600": "#0c7b83",
    "700": "#096066",
    "800": "#085055",
    "900": "#064246"
  },
  "cyan": {
    "50": "#f1fcff",
    "100": "#c2f1ff",
    "200": "#a5eaff",
    "300": "#81e2ff",
    "400": "#16c3f7",
    "500": "#14b3e3",
    "600": "#12a1cd",
    "700": "#0f86a9",
    "800": "#0d6e8b",
    "900": "#0a556c"
  },
  "blue": {
    "50": "#f0f7ff",
    "100": "#c8e0ff",
    "200": "#9fc9ff",
    "300": "#70aeff",
    "400": "#4194ff",
    "500": "#177afb",
    "600": "#1366d2",
    "700": "#0f4ea1",
    "800": "#0c4084",
    "900": "#0a356c"
  },
  "purple": {
    "50": "#f9f5ff",
    "100": "#e8d8ff",
    "200": "#d6bbff",
    "300": "#bc90ff",
    "400": "#a970ff",
    "500": "#8d41ff",
    "600": "#7317fd",
    "700": "#5f13d1",
    "800": "#4f10ad",
    "900": "#3b0c82"
  },
  "pink": {
    "50": "#fff5f9",
    "100": "#ffd6e8",
    "200": "#ffb3d4",
    "300": "#ff80b7",
    "400": "#ff539e",
    "500": "#ec1573",
    "600": "#cb1263",
    "700": "#a60f51",
    "800": "#830c40",
    "900": "#61092f"
  },
  "red": {
    "50": "#fff5f4",
    "100": "#ffd7d4",
    "200": "#ffb2ad",
    "300": "#ff8077",
    "400": "#ff5d52",
    "500": "#f32416",
    "600": "#ce1f13",
    "700": "#a7190f",
    "800": "#8e150d",
    "900": "#681009"
  },
  "primary": {
    "100": "#fff6ef",
    "200": "#ffd9bf",
    "300": "#ffb583",
    "400": "#ff8430",
    "500": "#f06e16",
    "600": "#ca5d12",
    "700": "#ab4e0f",
    "800": "#893f0c",
    "900": "#74350a"
  }
}

const theme = extendTheme({
  colors
})

export default theme