import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { getTrainById, getBookedSeats, saveBooking } from '../services/trainApi'
import WagonSelector from '../components/WagonSelector'
import SeatMap from '../components/SeatMap'
import BookingForm from '../components/BookingForm'
import styles from './Booking.module.css'

export default function Booking() {
    const { trainId } = useParams()
    const navigate = useNavigate()

    const [train, setTrain]               = useState(null)
    const [loading, setLoading]           = useState(true)
    const [error, setError]               = useState(null)
    const [selectedWagonId, setSelectedWagonId] = useState(null)
    const [selectedSeats, setSelectedSeats]     = useState([])
    const [bookedSeats, setBookedSeats]         = useState([])
    const [seatsLoading, setSeatsLoading]       = useState(false)
    const [bookingLoading, setBookingLoading]   = useState(false)

    // 1. GET /trains/:id
    useEffect(() => {
        getTrainById(trainId)
            .then(data => {
                setTrain(data)
                setSelectedWagonId(data.wagons[0]?.id || null)
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [trainId])

    // 2. GET заброньованих місць при зміні вагона
    useEffect(() => {
        if (!selectedWagonId) return
        setSeatsLoading(true)
        getBookedSeats(trainId, selectedWagonId)
            .then(seats => setBookedSeats(seats))
            .catch(() => setBookedSeats([]))
            .finally(() => setSeatsLoading(false))
    }, [trainId, selectedWagonId])

    function handleWagonSelect(wagonId) {
        setSelectedWagonId(wagonId)
        setSelectedSeats([])
    }

    function handleToggleSeat(num) {
        setSelectedSeats(prev =>
            prev.includes(num) ? prev.filter(s => s !== num) : [...prev, num]
        )
    }

    // 3. POST /bookings
    async function handleBookingSubmit(fields) {
        setBookingLoading(true)
        try {
            const wagon = train.wagons.find(w => w.id === selectedWagonId)
            await saveBooking({
                trainId: Number(trainId),
                trainNumber: train.number,
                from: train.from,
                to: train.to,
                wagonId: selectedWagonId,
                wagonNumber: wagon.number,
                wagonType: wagon.type,
                seats: selectedSeats,
                ...fields,
            })
            toast.success(
                `✅ Бронювання підтверджено! Місця ${selectedSeats.join(', ')} у вагоні ${wagon.number} на ім'я ${fields.name}`,
                { position: 'top-center', autoClose: 5000 }
            )
            setSelectedSeats([])
        } catch (e) {
            toast.error(`❌ Помилка: ${e.message}`, { position: 'top-center' })
        } finally {
            setBookingLoading(false)
        }
    }

    if (loading) return <div className={styles.state}>⏳ Завантаження...</div>
    if (error)   return <div className={styles.error}>❌ {error}</div>
    if (!train)  return <div className={styles.state}>Потяг не знайдено</div>

    const wagon = train.wagons.find(w => w.id === selectedWagonId)
    const wagonWithApiSeats = wagon ? { ...wagon, bookedSeats } : null

    return (
        <div>
            <ToastContainer />
            <div className={styles.header}>
                <button className={styles.back} onClick={() => navigate('/')}>← Назад до рейсів</button>
                <h1 className={styles.title}>Бронювання квитка</h1>
                <p className={styles.route}>🚂 Потяг №{train.number} &nbsp;•&nbsp; {train.from} → {train.to}</p>
            </div>
            <div className={styles.layout}>
                <div className={styles.left}>
                    <WagonSelector
                        wagons={train.wagons}
                        selectedWagonId={selectedWagonId}
                        onSelect={handleWagonSelect}
                    />
                    {seatsLoading
                        ? <div className={styles.state}>⏳ Завантаження місць...</div>
                        : <SeatMap
                            wagon={wagonWithApiSeats}
                            selectedSeats={selectedSeats}
                            onToggleSeat={handleToggleSeat}
                        />
                    }
                </div>
                <div className={styles.right}>
                    <BookingForm
                        selectedSeats={selectedSeats}
                        wagon={wagon}
                        train={train}
                        onSubmit={handleBookingSubmit}
                        loading={bookingLoading}
                    />
                </div>
            </div>
        </div>
    )
}