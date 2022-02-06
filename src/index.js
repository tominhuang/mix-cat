import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Breeds from './Breeds'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}></Route>
                <Route path="breeds/:breedId" element={<Breeds />}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
