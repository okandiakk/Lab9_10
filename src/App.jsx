import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Booking from './pages/Booking'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="booking/:trainId" element={<Booking />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}