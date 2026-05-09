import { useNavigate } from 'react-router-dom'
import styles from './TrainCard.module.css'

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' })
}

export default function TrainCard({ train }) {
    const navigate = useNavigate()
    const freeSeats = train.wagons.reduce(
        (acc, w) => acc + (w.totalSeats - w.bookedSeats.length), 0
    )
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.number}>🚂 Потяг №{train.number}</span>
                <span className={styles.date}>{formatDate(train.departure)}</span>
            </div>
            <div className={styles.route}>
                <div className={styles.city}>
                    <span className={styles.time}>{formatTime(train.departure)}</span>
                    <span className={styles.cityName}>{train.from}</span>
                </div>
                <div className={styles.arrow}>
                    <span className={styles.duration}>{train.duration}</span>
                    <div className={styles.line}>
                        <div className={styles.dot} />
                        <div className={styles.dash} />
                        <div className={styles.dot} />
                    </div>
                </div>
                <div className={styles.city}>
                    <span className={styles.time}>{formatTime(train.arrival)}</span>
                    <span className={styles.cityName}>{train.to}</span>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.meta}>
                    <span>🚃 {train.wagons.length} вагони</span>
                    <span>🪑 {freeSeats} вільних місць</span>
                </div>
                <button className={styles.btn} onClick={() => navigate(`/booking/${train.id}`)}>
                    Обрати місця →
                </button>
            </div>
        </div>
    )
}