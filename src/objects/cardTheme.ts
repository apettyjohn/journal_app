import {createTheme, ThemeOptions} from "@material-ui/core";

export const CardTheme = createTheme({
    overrides: {
        MuiCard: {
            root: {
                margin: '1rem',
                border: '2px solid #ffffff',
                boxShadow: '0px 2px 1px 1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                borderRadius: '10px'
            }
        }
    }
});