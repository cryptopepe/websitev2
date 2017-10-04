
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const constants = require('./../Constants')

class Themes {

    getMain() {
        return getMuiTheme({
            palette: {
                textColor: constants.COLOR_BLACK,
                alternateTextColor: constants.COLOR_WHITE_DARK,
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_ACCENT,
                canvasColor: constants.COLOR_WHITE
            },
            appBar: {
                height: 60,
            },
        })
    }

    getAppBar() {
        return getMuiTheme({
            palette: {
                textColor: constants.COLOR_WHITE,
                alternateTextColor: constants.COLOR_WHITE_DARK,
                primary1Color: constants.COLOR_TRANSPARENT,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_ACCENT
            },
            appBar: {
                height: 60,
            },
        })
    }

}

export default Themes
