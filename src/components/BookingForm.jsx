import { useState } from 'react'
import styles from './BookingForm.module.css'

function validate(fields) {
    const errors = {}
    if (!fields.name.trim()) errors.name = "Введіть ім'я"
    if (!/^\+?[\d\s\-]{10,15}$/.test(fields.phone)) errors.phone = 'Невірний номер телефону'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Невірний email'
    return errors
}

export default function BookingForm({ selectedSeats, wagon, train, onSubmit, loading }) {
    const [fields, setFields] = useState({ name: '', phone: '', email: '' })
    const [errors, setErrors] = useState({})

    function handleChange(e) {
        const { name, value } = e.target
        setFields(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        const errs = validate(fields)
        if (Object.keys(errs).length) { setErrors(errs); return }
        onSubmit(fields)
    }

    if (!selectedSeats.length) return (
        <div className={styles.empty}>⬅️ Оберіть хоча б одне місце</div>
    )

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>Дані пасажира</h3>
            <div className={styles.summary}>
                🚂 №{train?.number} &nbsp;|&nbsp;
                🚃 Вагон {wagon?.number} ({wagon?.type}) &nbsp;|&nbsp;
                🪑 Місця: {selectedSeats.join(', ')}
            </div>
            <div className={styles.field}>
                <label>Ім'я та прізвище</label>
                <input name="name" value={fields.name} onChange={handleChange}
                       placeholder="Іваненко Іван" className={errors.name ? styles.inputError : ''} />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
                <label>Номер телефону</label>
                <input name="phone" value={fields.phone} onChange={handleChange}
                       placeholder="+380XXXXXXXXX" className={errors.phone ? styles.inputError : ''} />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>
            <div className={styles.field}>
                <label>Email</label>
                <input name="email" value={fields.email} onChange={handleChange}
                       placeholder="email@example.com" className={errors.email ? styles.inputError : ''} />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <button className={styles.btn} type="submit" disabled={loading}>
                {loading ? '⏳ Збереження...' : '✅ Підтвердити бронювання'}
            </button>
        </form>
    )
}