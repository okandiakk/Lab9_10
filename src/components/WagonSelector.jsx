import styles from './WagonSelector.module.css'

const typeColor = { 'Плацкарт': '#e8f5e9', 'Купе': '#e3f2fd', 'СВ': '#fce4ec' }

export default function WagonSelector({ wagons, selectedWagonId, onSelect }) {
    return (
        <div className={styles.wrap}>
            <h3 className={styles.title}>Оберіть вагон</h3>
            <div className={styles.list}>
                {wagons.map(wagon => {
                    const free = wagon.totalSeats - wagon.bookedSeats.length
                    const isSelected = wagon.id === selectedWagonId
                    return (
                        <button
                            key={wagon.id}
                            className={`${styles.wagon} ${isSelected ? styles.selected : ''}`}
                            style={{ background: isSelected ? '#003087' : (typeColor[wagon.type] || '#f5f5f5') }}
                            onClick={() => onSelect(wagon.id)}
                        >
                            <span className={styles.num}>Вагон {wagon.number}</span>
                            <span className={styles.type}>{wagon.type}</span>
                            <span className={styles.free} style={{ color: isSelected ? '#aac4f7' : '#555' }}>
                {free} місць
              </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}