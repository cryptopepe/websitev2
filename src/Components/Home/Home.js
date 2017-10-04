/**
 * Created by user on 9/27/2017.
 */

import React, {Component} from 'react'

import {AppBar, Card, CircularProgress, FlatButton, MuiThemeProvider, Paper, RaisedButton, TextField} from 'material-ui'

import $ from 'jquery'
import {WOW} from 'wowjs/dist/wow'

import LocalizedStrings from 'react-localization'
import Themes from './../Base/Themes'

import './home.css'

const constants = require('../Constants')
const request = require('request')
const styles = require('../styles').styles
const themes = new Themes()

const strings = new LocalizedStrings(require('../Strings/home').strings)

class Home extends Component {

    constructor(props) {
        super(props)
        strings.setLanguage(constants.LANGUAGE_US)
        console.log(strings.getLanguage())
        this.state = {
            stats: {
                telegram: 640,
                twitter: null,
                assets: 679,
                masterToads: 200
            },
            marketCap: {
                loading: true
            },
            calculator: {
                toadCount: ''
            }
        }
    }

    componentWillMount = () => {
        this.apiGetters().marketCap()
        this.apiGetters().twitterCount()
    }

    componentDidMount = () => {
        new WOW().init()
    }

    apiGetters = () => {
        const self = this
        return {
            marketCap: () => {
                request(constants.COINMARKETCAP_TICKER_URL, (err, res, body) => {
                    let marketCap = {
                        loading: false
                    }
                    if (!err) {
                        try {
                            body = JSON.parse(body)
                            body.forEach((ticker) => {
                                if (ticker.id === 'memetic') {
                                    marketCap = ticker
                                    marketCap.loading = false
                                }
                            })
                        } catch (e) {
                            console.log(e.message)
                        }
                    }
                    self.setState({
                        marketCap: marketCap
                    })
                })
            },
            twitterCount: () => {
                request({
                        url: constants.TWITTER_INFO_URL,
                        headers: {
                            origin: 'localhost',
                            'X-Requested-With': 'http://memetic.ai'
                        }
                    },
                    (err, res, body) => {
                        if (!err) {
                            try {
                                body = JSON.parse(body)[0]
                                let stats = self.state.stats
                                stats.twitter = body.followers_count.toLocaleString()
                                console.log(stats)
                                self.setState({
                                    stats: stats
                                })
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                    })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            dailyToadReturns: () => {
                return ((23000 * 0.375) / 200) * parseInt(self.state.calculator.toadCount)
            },
            monthlyToadReturnUsd: () => {
                return ((self.helpers().dailyToadReturns() * 30) * self.state.marketCap.price_usd).toFixed(2)
            },
            selectLanguage: (language) => {
                strings.setLanguage(language)
                self.setState({})
            }
        }
    }

    views = () => {
        const self = this
        return {
            appbar: () => {
                return <MuiThemeProvider muiTheme={themes.getAppBar()}>
                    <AppBar
                        zDepth={0}
                        style={styles.appbar}
                        className="appbar"
                        showMenuIconButton={false}
                        title={
                            <div className="appbar-title container">
                                <a href="https://memetic.ai">
                                    <img src={process.env.PUBLIC_URL + "/assets/img/logo.png"}
                                         className="logo"/>
                                </a>
                            </div>
                        }
                        iconElementRight={
                            <div className="row mt-2">
                                {   constants.LANGUAGES_AVAILABLE.map((language) =>
                                    <div className="col-2">
                                        <span className={"flag-icon flag-icon-" + language + " clickable"}
                                              onClick={() => {
                                                  self.helpers().selectLanguage(language)
                                              }}/>
                                    </div>
                                )}
                            </div>
                        }
                    />
                </MuiThemeProvider>
            },
            cover: () => {
                return <div className="cover">
                    <div className="stripes">
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 info">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="row">
                                                <div className="col-12">
                                                    <h1 className="mt-3 wow fadeIn">{strings.cover.header}</h1>
                                                    <h5 className="wow fadeIn">{strings.cover.subHeader}</h5>
                                                </div>
                                                <div className="col-8 col-md-8 col-xl-5 wow fadeIn">
                                                    <RaisedButton
                                                        label={strings.cover.learnMore}
                                                        className="mt-4 hvr-float btn-block"
                                                        style={styles.button.green.button}
                                                        buttonStyle={styles.button.green.button}
                                                        overlayStyle={styles.button.green.button}
                                                        labelStyle={styles.button.green.label}
                                                        onClick={() => {
                                                            $('html,body').animate({
                                                                scrollTop: $(".whatis").offset().top
                                                            }, 'slow')
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-8 col-md-8 col-xl-5 wow fadeIn">
                                                    <RaisedButton
                                                        label={strings.cover.tryNow}
                                                        href="https://github.com/pepeteam/pepecoin/releases/tag/2.5.2.0"
                                                        className="mt-4 hvr-float btn-block"
                                                        style={styles.button.white.button}
                                                        buttonStyle={styles.button.white.button}
                                                        overlayStyle={styles.button.white.button}
                                                        labelStyle={styles.button.white.label}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden-sm-down col-md-6 logo">
                                <img
                                    className="mx-auto wow fadeInUp"
                                    src={process.env.PUBLIC_URL + '/assets/img/logo.png'}/>
                            </div>
                        </div>
                    </div>
                </div>
            },
            kekdaq: () => {
                return <div className="kekdaq">
                    {/*<img src={process.env.PUBLIC_URL + '/assets/img/mockup.png'} className="mockup"/>*/}
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <img src={process.env.PUBLIC_URL + '/assets/img/kekdaq.png'} className="logo mx-auto"/>
                            </div>
                            <div className="col-12 col-md-6 wow fadeIn">
                                <h1>{strings.kekdaq.header}</h1>
                                <h5>{strings.kekdaq.info}</h5>
                                <hr className="mt-4"/>
                                <a href="https://kekdaq.com" className="hvr-grow">{strings.kekdaq.discover} ></a>
                            </div>
                        </div>
                    </div>
                </div>
            },
            features: () => {
                return <div className="features">
                    <div className="container">
                        <div className="row">
                            {self.views().featureCard(strings.features.secure.title,
                                strings.features.secure.message, 'secure.png', 0)}
                            {self.views().featureCard(strings.features.simple.title,
                                strings.features.simple.message, 'simple.png', 0)}
                            {self.views().featureCard(strings.features.openSource.title,
                                strings.features.openSource.message, 'open-source.png', 0)}
                        </div>
                    </div>
                </div>
            },
            featureCard: (title, message, imgFilename, index) => {
                const cardStyle = JSON.parse(JSON.stringify(styles.card))
                cardStyle.minHeight = '65vh'
                if (index == 0)
                    cardStyle.background = '#71de3f'
                else if (index == 1)
                    cardStyle.background = '#63c838'
                else if (index == 2)
                    cardStyle.background = '#56ab2f'
                return <div className="col-12 mt-md-0 col-md-4 hvr-float feature-card-div">
                    <Card style={cardStyle}
                          zDepth={3}>
                        <div className="row feature-card wow fadeIn">
                            <div className="col">
                                <h3>{title}</h3>
                                <img src={process.env.PUBLIC_URL + '/assets/img/' + imgFilename}/>
                                <p>{message}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            },
            whatIs: () => {
                const style = JSON.parse(JSON.stringify(styles.card))
                style.height = '100%'
                style.cursor = 'pointer'
                return <div className="whatis">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 hvr-float card-div">
                                <Card style={style}
                                      zDepth={3}>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col py-4 px-2 p-md-4 wow fadeIn">
                                                <h3>{strings.whatis.whatIsMemetic.header}</h3>
                                                <p>{strings.whatis.whatIsMemetic.info1}
                                                    <br/><br/>
                                                    {strings.whatis.whatIsMemetic.info2}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="col-12 col-md-6 hvr-float card-div">
                                <Card style={style}
                                      zDepth={3}>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col py-4 px- p-md-4 wow fadeIn">
                                                <h3>{strings.whatis.useCases.header}</h3>
                                                <p>{strings.whatis.useCases.info1}
                                                    <br/><br/>
                                                    {strings.whatis.useCases.info2}
                                                    <br/><br/>
                                                    {strings.whatis.useCases.info3}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            },
            info: () => {
                return <div className="coin-info">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 specs">
                                <div className="row">
                                    <div className="col-3">
                                        <img src={process.env.PUBLIC_URL + '/assets/img/blockspec.png'}/>
                                    </div>
                                    <div className="col-9 pl-0">
                                        <h2>{strings.coinInfo.specs.header}</h2>
                                    </div>
                                </div>
                                <ul>
                                    {strings.coinInfo.specs.list.map((item) =>
                                        <li>{item}</li>
                                    )}
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 coin-features">
                                <div className="row">
                                    <div className="col-3">
                                        <img src={process.env.PUBLIC_URL + '/assets/img/features.png'}/>
                                    </div>
                                    <div className="col-9 pl-0">
                                        <h2>{strings.coinInfo.features.header}</h2>
                                    </div>
                                </div>
                                <ul>
                                    {strings.coinInfo.features.list.map((item) =>
                                        <li>{item}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            },
            stats: () => {
                return <div className="stats">
                    <div className="container">
                        <div className="row">
                            {self.views().statsCard(strings.stats.telegram, 'telegram.png',
                                self.state.stats.telegram)}
                            {self.views().statsCard(strings.stats.twitter, 'twitter.png',
                                self.state.stats.twitter)}
                            {self.views().statsCard(strings.stats.assets, 'assets.png',
                                self.state.stats.assets)}
                            {self.views().statsCard(strings.stats.mastertoads, 'mastertoad.png',
                                self.state.stats.masterToads)}
                        </div>
                    </div>
                </div>
            },
            statsCard: (title, imgFilename, stat) => {
                return <div className="col-12 col-md-3 wow fadeIn stats-card">
                    <h1>{title}</h1>
                    <Paper style={styles.paper} circle={true} className="hvr-float clickable" zDepth={2}>
                        <img src={process.env.PUBLIC_URL + '/assets/img/' + imgFilename}/>
                    </Paper>
                    {stat != null &&
                    <h3>{stat}</h3>
                    }
                    {stat == null &&
                    <h3>{self.views().tinyLoader()}</h3>
                    }
                </div>
            },
            resources: () => {
                return <div className="resources">
                    <div className="container">
                        <div className="row mb-4">
                            <div className="header-block">
                                <img src={process.env.PUBLIC_URL + '/assets/img/resources.png'}
                                     className="header-icon center-block img-responsive"/>
                                <h1 className="header-text">{strings.resources.header}</h1>
                            </div>
                        </div>
                        <div className="row">
                            {self.views().resourceCard(
                                strings.resources.windowsWallet,
                                'windows.png',
                                'https://github.com/pepeteam/pepecoin/releases/tag/2.5.2.0')}
                            {self.views().resourceCard(
                                strings.resources.macWallet,
                                'mac.png',
                                '#')}
                            {self.views().resourceCard(
                                strings.resources.bittrex,
                                'bittrex.png',
                                'https://bittrex.com/market/?marketName=BTC-MEME')}
                            {self.views().resourceCard(
                                strings.resources.cryptopia,
                                'cryptopia.png',
                                'https://www.cryptopia.co.nz/Exchange?market=PEPE_BTC')}
                            {self.views().resourceCard(
                                strings.resources.telegram,
                                'telegram.png',
                                'https://t.me/pepecoins')}
                            {self.views().resourceCard(
                                strings.resources.bitcointalk,
                                'bitcointalk.png',
                                'https://bitcointalk.org/index.php?topic=1391598.0')}
                        </div>
                    </div>
                </div>
            },
            resourceCard: (title, imgFilename, url) => {
                return <div className="col-12 col-md-4 resource-card wow fadeIn">
                    <Paper style={styles.paper} circle={true} className="hvr-float clickable" zDepth={2}>
                        <a href={url}>
                            <img src={process.env.PUBLIC_URL + '/assets/img/' + imgFilename}
                                 className={'icon'}/>
                        </a>
                    </Paper>
                    <p className="text-center">{title}</p>
                </div>
            },
            marketCap: () => {
                const cardStyle = JSON.parse(JSON.stringify(styles.card))
                cardStyle.padding = 30
                cardStyle.cursor = 'pointer'
                return <div className="market-cap">
                    <hr/>
                    <div className="container">
                        <div className="row">
                            <div className="header-block">
                                <img src={process.env.PUBLIC_URL + '/assets/img/market-stats.png'}
                                     className="header-icon center-block img-responsive"/>
                                <h1 className="header-text">{strings.marketCap.header}</h1>
                            </div>
                        </div>
                        <div className="row">
                            {!self.state.marketCap.loading &&
                            <div className="col-12 market-stats">
                                <div className="row">
                                    <div className="col-12 col-md-4 hvr-float stats-card">
                                        <Card style={cardStyle} zDepth={2}>
                                            <div className="row">
                                                <div className="col">
                                                    <h3>{self.state.marketCap.price_usd}$</h3>
                                                    <h4>{strings.marketCap.memePrice}</h4>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="col-12 col-md-4 hvr-float stats-card">
                                        <Card style={cardStyle} zDepth={2}>
                                            <div className="row">
                                                <div className="col">
                                                    <h3>{parseInt(self.state.marketCap.market_cap_usd).toLocaleString()}$</h3>
                                                    <h4>{strings.marketCap.marketCap}</h4>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="col-12 col-md-4 hvr-float stats-card">
                                        <Card style={cardStyle} zDepth={2}>
                                            <div className="row">
                                                <div className="col">
                                                    <h3>{self.state.marketCap.percent_change_24h}%</h3>
                                                    <h4>{strings.marketCap.dailyChange}</h4>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            },
            roi: () => {
                return <div className="roi">
                    <div className="container">
                        <div className="row">
                            <div className="header-block">
                                <img src={process.env.PUBLIC_URL + '/assets/img/roi.png'}
                                     className="header-icon center-block img-responsive"/>
                                <h1 className="header-text">{strings.roi.header}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h2>10,000%</h2>
                                <h4>{strings.roi.since}</h4>
                            </div>
                            <div className="col-12 col-md-6">
                                <h2>10%</h2>
                                <h4>{strings.roi.perMonth}</h4>
                            </div>
                            <div className="col-12" style={{
                                marginTop: 45
                            }}>
                                <hr/>
                            </div>
                            <div className="col-12" style={{
                                marginTop: 45
                            }}>
                                <div className="row">
                                    <div className="header-block">
                                        <img src={process.env.PUBLIC_URL + '/assets/img/mastertoad.png'}
                                             className="header-icon center-block img-responsive"/>
                                        <h1 className="header-text">{strings.roi.calculator}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12" style={{
                                marginBottom: 45
                            }}>
                                <TextField
                                    hintText={strings.roi.enterNumberOfToads}
                                    type="number"
                                    value={self.state.calculator.toadCount}
                                    hintStyle={styles.textField.hintStyle}
                                    floatingLabelStyle={styles.textField.floatingLabelStyle}
                                    inputStyle={styles.textField.inputStyle}
                                    onChange={(event, value) => {
                                        let calculator = self.state.calculator
                                        calculator.toadCount = value
                                        console.log(calculator.toadCount)
                                        self.setState({
                                            calculator: calculator
                                        })
                                    }}
                                    className="text-field"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <h4>Requirement</h4>
                                {   self.state.calculator.toadCount != '' &&
                                <p>{(parseInt(self.state.calculator.toadCount) * 15000).toLocaleString() + ' MEME'}</p>
                                }
                                {   self.state.calculator.toadCount == '' &&
                                <p>0 MEME</p>
                                }
                            </div>
                            <div className="col-12 mt-4 mt-md-0 col-md-6">
                                <h4>Returns</h4>
                                {   self.state.calculator.toadCount != '' &&
                                <p>{(self.helpers().dailyToadReturns()).toLocaleString() + ' MEME/' + strings.roi.day}
                                    {self.state.marketCap.hasOwnProperty('price_usd') &&
                                    <span>
                                        <br/>
                                        {self.helpers().monthlyToadReturnUsd() + ' USD/' + strings.roi.month}
                                    </span>
                                    }</p>

                                }
                                {   self.state.calculator.toadCount == '' &&
                                <p>0 MEME</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            },
            footer: () => {
                return <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-4">
                                <p>{strings.footer.memeticFoundation}</p>
                            </div>
                            <div className="col-8 col-md-6">
                                <div className="row">
                                    <div className="offset-3 col-9 offset-md-0 col-md-3">
                                        <FlatButton
                                            style={styles.flatButton}
                                            labelStyle={{
                                                textAlign: 'right'
                                            }}
                                            label={strings.footer.links.home}
                                            href="#"
                                        />
                                    </div>
                                    <div className="offset-3 col-9 offset-md-0 col-md-3">
                                        <FlatButton
                                            style={styles.flatButton}
                                            label={strings.footer.links.kekdaq}
                                            href="https://kekdaq.com"
                                        />
                                    </div>
                                    <div className="offset-3 col-9 offset-md-0 col-md-3">
                                        <FlatButton
                                            style={styles.flatButton}
                                            label={strings.footer.links.bitcointalk}
                                            href="https://bitcointalk.org/index.php?topic=1391598.0"
                                        />
                                    </div>
                                    <div className="offset-3 col-9 offset-md-0 col-md-3">
                                        <FlatButton
                                            style={styles.flatButton}
                                            label={strings.footer.links.telegram}
                                            href="https://t.me/pepecoins"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hidden-sm-down col-md-2">
                                <a href="https://memetic.ai">
                                    <img src={process.env.PUBLIC_URL + '/assets/img/logo.png'}/>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            },
            tinyLoader: () => {
                return <CircularProgress size={16} color={constants.COLOR_PRIMARY}/>
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getMain()}>
                <div className="home">
                    {self.views().appbar()}
                    {self.views().cover()}
                    {self.views().kekdaq()}
                    {self.views().features()}
                    {self.views().whatIs()}
                    {self.views().info()}
                    {self.views().stats()}
                    {self.views().resources()}
                    {self.views().marketCap()}
                    {self.views().roi()}
                    {self.views().footer()}
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Home