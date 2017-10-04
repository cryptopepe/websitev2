import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter } from 'react-router-dom'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

import Home from './Components/Home/Home'

ReactDOM.render(
    <BrowserRouter>
        <Route path="/" component={Home}/>
    </BrowserRouter>,
    document.getElementById('root')
)