type fontWeight = {
  id: number;
  text: string;
  done: boolean;
};

export const theme = {
  buttonSize: {
    xxsmall: 8,
    xsmall: 10,
    small: 12,
    medium: 14,
    default: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 22,
  },
  fontSize: {
    xxsmall: 11,
    xsmall: 12.5,
    small: 14,
    medium: 16,
    large: 20,
    xlarge: 26,
    xxlarge: 32,
  },
  colors: {
    primary: "#424242",
    secondary: "#f9a825",
    tertiary: "#e53935",
    disabled: "rgba(131, 131, 131, 0.48)",
    gray_primary: "#696969",
    white_primary: "#EBEBEB",
    black_primary: "#1B1B1B",
    white: "#fff",
  },
  space: {
    xxsmall: 2.5,
    xsmall: 5,
    small: 7.5,
    medium: 10,
    large: 12.5,
    xlarge: 15,
    xxlarge: 20,
    xxxlarge: 30,
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    bold: "600",
    xbold: "700",
    xxbold: "800",
  },
};
