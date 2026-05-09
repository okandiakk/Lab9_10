import { useState, useEffect } from 'react'
import { getBookings } from '../services/trainApi'
import styles from './MyBookings.module.css'

export default function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState(null)

    useEffect(() => {
        getBookings()
            .then(data => setBookings(data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className={styles.state}>⏳ Завантаження...</div>
    if (error)   return <div className={styles.error}>❌ {error}</div>

    return (
        <div>
            <div className={styles.hero}>
                <h1 className={styles.title}>Мої бронювання</h1>
                <p className={styles.subtitle}>Усі придбані квитки</p>
            </div>
            {bookings.length === 0 ? (
                <div className={styles.empty}>
                    <span>🎫</span>
                    <p>У вас ще немає бронювань</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {[...bookings].reverse().map(b => (
                        <div key={b.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.trainNum}>🚂 Потяг №{b.trainNumber}</span>
                                <span className={styles.date}>
                  {b.createdAt
                      ? new Date(b.createdAt).toLocaleString('uk-UA', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                      })
                      : '—'}
                </span>
                            </div>
                            <div className={styles.route}>
                                <span className={styles.city}>{b.from}</span>
                                <span className={styles.arrow}>→</span>
                                <span className={styles.city}>{b.to}</span>
                            </div>
                            <div className={styles.details}>
                                <div className={styles.detail}>
                                    <span className={styles.label}>Вагон</span>
                                    <span className={styles.value}>№{b.wagonNumber} · {b.wagonType}</span>
                                </div>
                                <div className={styles.detail}>
                                    <span className={styles.label}>Місця</span>
                                    <span className={styles.value}>{b.seats?.join(', ')}</span>
                                </div>
                                <div className={styles.detail}>
                                    <span className={styles.label}>Пасажир</span>
                                    <span className={styles.value}>{b.name}</span>
                                </div>
                                <div className={styles.detail}>
                                    <span className={styles.label}>Телефон</span>
                                    <span className={styles.value}>{b.phone}</span>
                                </div>
                                <div className={styles.detail}>
                                    <span className={styles.label}>Email</span>
                                    <span className={styles.value}>{b.email}</span>
                                </div>
                            </div>
                            <div className={styles.seatsRow}>
                                {b.seats?.map(s => (
                                    <span key={s} className={styles.seat}>{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}