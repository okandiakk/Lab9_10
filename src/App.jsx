import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="booking/:trainId" element={<Booking />} />
                    <Route path="my-bookings" element={<MyBookings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}