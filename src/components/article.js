import React from 'react'
import { withStyles } from 'material-ui/styles'
import withRoot from '../withRoot'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import OpenInNewIcon from 'react-material-icon-svg/dist/OpenInNewIcon'
import FormatAlignJustifyIcon from 'react-material-icon-svg/dist/FormatAlignJustifyIcon'
import { CardContent } from 'material-ui/Card'
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '4%',
    fontFamily: 'Roboto'
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  }
})

class Article extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  rawMarkup = (html) => {
    return { __html: html }
  }

  showArticle = (url) => {
    window.open(url, '_blank')
  }

  render () {
    const { title, date, body, url, img, bodyText } = this.props
    const { classes } = this.props
    return (
      <div>
        <Grid container>
          <Grid item xs={12} style={{borderBottom: '2px solid #66bb6a'}}>
            <Typography variant="display1" gutterBottom style={{marginTop: 10}}>
              {title}
            </Typography>
            <Typography gutterBottom>
              {date}
            </Typography>
            <img className={classes.img} src={img} alt="" style={{float: 'left', marginTop: '0px', marginRight: '25px', marginBottom: '10px'}}></img>
            <Typography className={classes.body} gutterBottom>
              {body}
            </Typography>
            <div style={{margin: 'auto', textAlign: 'right'}}>
              <IconButton
                tooltip="View article body"
                onClick={() => this.handleOpen()}
                style={styles.large}
              >
                <FormatAlignJustifyIcon />
              </IconButton>
              <IconButton
                tooltip="View external source"
                onClick={() => this.showArticle(url)}
                style={styles.large}
              >
                <OpenInNewIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.open}
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={false}
        >
          <DialogTitle id="alert-dialog-title" style={{background: 'linear-gradient(60deg, #66bb6a, #338a3e)'}}>{title}</DialogTitle>
          <DialogContent>
            <Typography style={{marginTop: 10}}>{date}</Typography>
            <CardContent>
              <Typography>
               <span dangerouslySetInnerHTML={this.rawMarkup(bodyText)} />
              </Typography>
            </CardContent>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(Article))
