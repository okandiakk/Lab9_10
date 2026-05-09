import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

const api = axios.create({ baseURL: BASE_URL })

// Отримання списку рейсів
export async function getTrains() {
    const res = await api.get('/trains')
    return res.data
}

// Отримання одного рейсу за id
export async function getTrainById(id) {
    const res = await api.get(`/trains/${id}`)
    return res.data
}

// Отримання заброньованих місць для конкретного вагона
export async function getBookedSeats(trainId, wagonId) {
    const res = await api.get(`/trains/${trainId}/wagons/${wagonId}/seats`)
    return res.data.bookedSeats
}

// Збереження бронювання — сервер сам оновить bookedSeats у вагоні
export async function saveBooking(bookingData) {
    const res = await api.post('/bookings', bookingData)
    return res.data
}

// Отримання всіх бронювань
export async function getBookings() {
    const res = await api.get('/bookings')
    return res.data
}