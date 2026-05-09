import { useState } from 'react'
import TrainCard from './TrainCard'
import styles from './TrainList.module.css'

export default function TrainList({ trains }) {
    const [query, setQuery] = useState('')

    const filtered = trains.filter(t => {
        const q = query.toLowerCase()
        return (
            t.number.toLowerCase().includes(q) ||
            t.from.toLowerCase().includes(q) ||
            t.to.toLowerCase().includes(q)
        )
    })

    return (
        <div>
            <div className={styles.searchWrap}>
                <input
                    className={styles.search}
                    type="text"
                    placeholder="🔍 Пошук за маршрутом або номером потяга..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                {query && <button className={styles.clear} onClick={() => setQuery('')}>✕</button>}
            </div>
            {filtered.length === 0 ? (
                <div className={styles.empty}>
                    <span style={{ fontSize: 48 }}>🔍</span>
                    <p>Рейси не знайдено</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {filtered.map(train => <TrainCard key={train.id} train={train} />)}
                </div>
            )}
        </div>
    )
}