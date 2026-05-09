import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001
const DB_FILE = join(__dirname, 'db.json')

// ── Ініціалізація бази даних ──────────────────────────────
let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))

const saveToDB = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))

app.use(cors())
app.use(express.json())

// ── МАРШРУТИ ─────────────────────────────────────────────

// Отримати всі рейси
app.get('/trains', (req, res) => res.json(db.trains))

// Отримати один рейс за id
app.get('/trains/:id', (req, res) => {
    const train = db.trains.find(t => t.id === Number(req.params.id))
    train ? res.json(train) : res.status(404).json({ message: 'Рейс не знайдено' })
})

// Отримати заброньовані місця конкретного вагона
app.get('/trains/:trainId/wagons/:wagonId/seats', (req, res) => {
    const train = db.trains.find(t => t.id === Number(req.params.trainId))
    if (!train) return res.status(404).json({ message: 'Рейс не знайдено' })
    const wagon = train.wagons.find(w => w.id === req.params.wagonId)
    if (!wagon) return res.status(404).json({ message: 'Вагон не знайдено' })
    res.json({ bookedSeats: wagon.bookedSeats })
})

// Створити бронювання + позначити місця як зайняті
app.post('/bookings', (req, res) => {
    const { trainId, wagonId, seats, name, phone, email,
        trainNumber, from, to, wagonNumber, wagonType } = req.body

    if (!trainId || !wagonId || !seats?.length || !name || !phone || !email) {
        return res.status(400).json({ message: 'Заповніть всі поля' })
    }

    const trainIndex = db.trains.findIndex(t => t.id === Number(trainId))
    if (trainIndex === -1) return res.status(404).json({ message: 'Рейс не знайдено' })

    const wagonIndex = db.trains[trainIndex].wagons.findIndex(w => w.id === wagonId)
    if (wagonIndex === -1) return res.status(404).json({ message: 'Вагон не знайдено' })

    const wagon = db.trains[trainIndex].wagons[wagonIndex]

    const alreadyBooked = seats.filter(s => wagon.bookedSeats.includes(s))
    if (alreadyBooked.length > 0) {
        return res.status(409).json({ message: `Місця ${alreadyBooked.join(', ')} вже заброньовані` })
    }

    db.trains[trainIndex].wagons[wagonIndex].bookedSeats = [...wagon.bookedSeats, ...seats]

    const newBooking = {
        id: Date.now(),
        trainId: Number(trainId),
        trainNumber, from, to,
        wagonId, wagonNumber, wagonType,
        seats, name, phone, email,
        createdAt: new Date().toISOString()
    }
    db.bookings.push(newBooking)
    saveToDB()

    res.status(201).json(newBooking)
})

// Отримати всі бронювання
app.get('/bookings', (req, res) => res.json(db.bookings))

app.listen(PORT, () => {
    console.log(`🚂 Сервер запущено: http://localhost:${PORT}`)
    console.log(`   GET  /trains`)
    console.log(`   GET  /trains/:id`)
    console.log(`   GET  /trains/:trainId/wagons/:wagonId/seats`)
    console.log(`   POST /bookings`)
    console.log(`   GET  /bookings`)
})