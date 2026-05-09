import { useState, useEffect } from 'react'
import { getTrains } from '../services/trainApi'
import TrainList from '../components/TrainList'
import styles from './Home.module.css'

export default function Home() {
    const [trains, setTrains] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getTrains()
            .then(setTrains)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <div className={styles.hero}>
                <h1 className={styles.title}>Розклад потягів</h1>
                <p className={styles.subtitle}>Знайдіть зручний рейс та оберіть місця у вагоні</p>
            </div>
            {loading && <div className={styles.state}>⏳ Завантаження рейсів...</div>}
            {error   && <div className={styles.error}>❌ {error} — переконайтесь що сервер запущений: npm run server</div>}
            {!loading && !error && <TrainList trains={trains} />}
        </div>
    )
}