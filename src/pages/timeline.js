import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withRoot from '../withRoot'
import { CircularProgress } from 'material-ui/Progress'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { Event } from 'material-ui-icons'
import { base } from '../config'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Grid, Chip, Typography, withStyles } from 'material-ui'
import { getDate } from '../time'
import { Navigation } from '../components'

const styles = theme => ({
  root: {
    // need to fix the background
    backgroundColor: 'rgb(227,227,227)',
    minHeight: '100vh'
  },
  chip: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    fontSize: ''
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: 'black'
    }
  },
  title: {
    color: theme.palette.primary.main,
    marginTop: '1em'
  },
  subTitle: {
    color: theme.palette.secondary.main
  },
  loader: {
    marginTop: 20,
    textAlign: 'center'
  }
})

const bgCols = [
  '#AB47B8',
  '#26c6da',
  '#ef5350',
  '#66bb6a'
]

class Timeline extends React.Component {

  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    currentUser: this.props.currentUser,
    eventData: {}
  }

  componentDidMount() {
    this.ref = base.syncState(`timeline`, {
      context: this,
      state: 'eventData'
    })
  }

  constructor (props) {
    super(props)
    document.getElementById('global').style.overflow = 'scroll'
  }

  render () {
    const { classes } = this.props
    const { currentUser, eventData } = this.state

    //need to clean data up a bit
    let sortedEvents = {}
    _.map(_.pickBy(eventData, _.identity), (x,i) => sortedEvents[i] = x)
    sortedEvents = _.sortBy(sortedEvents, x => x.start_date)


    document.title = 'EventStock'

    return (
      <div>
        <Navigation isAdmin={currentUser.admin}/>
        <Grid container direction='column' className={classes.root}>
          <Grid item container justify='center' direction='row'>
            <Grid item xs={8}>
              <Grid container alignItems='center' direction='column'>
                <Grid item>
                  <Typography variant='display3' gutterBottom className={classes.title}>
                    EventStock
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='subheading' gutterBottom className={classes.subTitle}>
                    Welcome to EventStock! Here to answer the Who, Why and How of the Financial Markets.
                    Please browse the timeline below to see the events that have, and continue to, significantly impact major listed stocks.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direction='row'>
            <Grid item xs={12}>
              { _.isEmpty(sortedEvents) ?
                <div className={classes.loader}>
                  <CircularProgress size={60}/>
                </div>
                :
                <VerticalTimeline>
                  { _.map(_.keys(sortedEvents), (k, i) =>
                    <VerticalTimelineElement
                      key={i}
                      className='vertical-timeline-element--work'
                      date={`${moment(sortedEvents[k].start_date * 1000).format('DD MMM YY')} - ${getDate(sortedEvents[k].end_date)}`}
                      iconStyle={{ background: bgCols[i % bgCols.length], color: '#fff' }}
                      icon={<Event />}
                  >
                      <Link to={{
                        pathname: `event/${k}`,
                        state: {currentUser: currentUser, eventData: sortedEvents[k]}
                        }}
                        className={classes.link}>
                        <Typography variant='title' className='vertical-timeline-element-title' gutterBottom>
                          {sortedEvents[k].name}
                        </Typography>
                      </Link>
                      <Typography gutterBottom>
                        {sortedEvents[k].description}
                      </Typography>
                      <div>
                        {_.map(sortedEvents[k].related_companies, (c, i) =>
                          <Chip label={i} className={classes.chip} key={i} />
                    )}
                      </div>
                    </VerticalTimelineElement>
                  )}
                </VerticalTimeline>
              }
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withRouter(withRoot(withStyles(styles)(Timeline)))
