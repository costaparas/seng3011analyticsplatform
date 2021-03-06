import React from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import 'typeface-roboto'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#647786',
      main: '#394b59',
      dark: '#112330'
    },
    secondary: {
      light: '#df78ef',
      main: '#ab47bc',
      dark: '#790e8b'
    }
  }
})

function withRoot (Component) {
  function WithRoot (props) {
    return (
      <MuiThemeProvider theme={theme}>
        <Component {...props} />
      </MuiThemeProvider>
    )
  }
  return WithRoot
}

export default withRoot
