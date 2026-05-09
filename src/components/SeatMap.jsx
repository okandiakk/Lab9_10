import styles from './SeatMap.module.css'

// ── Плацкарт: 8 купе (місця 1-36) + 9 бічних відсіків (37-54) ──
function PlatskarLayout({ bookedSeats, selectedSeats, onToggle }) {
    const compartments = Array.from({ length: 8 }, (_, i) => ({
        lower: [i * 4 + 1, i * 4 + 2],
        upper: [i * 4 + 3, i * 4 + 4],
    }))
    const side = Array.from({ length: 9 }, (_, i) => ({
        lower: 37 + i * 2,
        upper: 37 + i * 2 + 1,
    }))

    const seatBtn = (num) => {
        if (num > 54) return null
        const isBooked   = bookedSeats.includes(num)
        const isSelected = selectedSeats.includes(num)
        const cls = isBooked ? styles.booked : isSelected ? styles.selected : styles.free
        return (
            <button key={num} className={`${styles.seat} ${cls}`}
                    disabled={isBooked} onClick={() => onToggle(num)} title={`Місце ${num}`}>
                {num}
            </button>
        )
    }

    return (
        <div className={styles.platskarWrap}>
            <div className={styles.platskarMain}>
                <div className={styles.conductor}><span>🚶</span></div>
                {compartments.map((c, i) => (
                    <div key={i} className={styles.compartment}>
                        <div className={styles.row}>{seatBtn(c.lower[0])}{seatBtn(c.lower[1])}</div>
                        <div className={styles.divider} />
                        <div className={styles.row}>{seatBtn(c.upper[0])}{seatBtn(c.upper[1])}</div>
                    </div>
                ))}
                <div className={styles.conductor}><span>🚶</span></div>
            </div>
            <div className={styles.platskarSide}>
                <span className={styles.sideLabel}>Бічні</span>
                <div className={styles.sideSeats}>
                    {side.map((s, i) => (
                        <div key={i} className={styles.sideCompartment}>
                            {seatBtn(s.upper)}{seatBtn(s.lower)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Купе: 9 купе × 4 місця ──────────────────────────────────
function KupeLayout({ bookedSeats, selectedSeats, onToggle }) {
    const compartments = Array.from({ length: 9 }, (_, i) => ({
        num: i + 1,
        seats: [i * 4 + 1, i * 4 + 2, i * 4 + 3, i * 4 + 4],
    }))

    const seatBtn = (num, label) => {
        const isBooked   = bookedSeats.includes(num)
        const isSelected = selectedSeats.includes(num)
        const cls = isBooked ? styles.booked : isSelected ? styles.selected : styles.free
        return (
            <button key={num} className={`${styles.seat} ${styles.kupeSeat} ${cls}`}
                    disabled={isBooked} onClick={() => onToggle(num)} title={`Місце ${num} (${label})`}>
                {num}
            </button>
        )
    }

    return (
        <div className={styles.kupeWrap}>
            <div className={styles.conductor}><span>🚶</span></div>
            {compartments.map((c) => (
                <div key={c.num} className={styles.kupeCompartment}>
                    <div className={styles.kupeRow}>{seatBtn(c.seats[0], 'нижнє')}{seatBtn(c.seats[1], 'нижнє')}</div>
                    <div className={styles.kupeDivider} />
                    <div className={styles.kupeRow}>{seatBtn(c.seats[2], 'верхнє')}{seatBtn(c.seats[3], 'верхнє')}</div>
                    <div className={styles.kupeLabel}>К{c.num}</div>
                </div>
            ))}
            <div className={styles.conductor}><span>🚶</span></div>
        </div>
    )
}

// ── СВ: 9 купе × 2 місця ────────────────────────────────────
function SvLayout({ bookedSeats, selectedSeats, onToggle }) {
    const compartments = Array.from({ length: 9 }, (_, i) => ({
        num: i + 1, lower: i * 2 + 1, upper: i * 2 + 2,
    }))

    const seatBtn = (num, label) => {
        const isBooked   = bookedSeats.includes(num)
        const isSelected = selectedSeats.includes(num)
        const cls = isBooked ? styles.booked : isSelected ? styles.selected : styles.free
        return (
            <button key={num} className={`${styles.seat} ${styles.svSeat} ${cls}`}
                    disabled={isBooked} onClick={() => onToggle(num)} title={`Місце ${num} (${label})`}>
                {num}
            </button>
        )
    }

    return (
        <div className={styles.svWrap}>
            <div className={styles.conductor}><span>🚶</span></div>
            {compartments.map((c) => (
                <div key={c.num} className={styles.svCompartment}>
                    <div className={styles.svRow}>{seatBtn(c.lower, 'нижнє')}{seatBtn(c.upper, 'верхнє')}</div>
                    <div className={styles.svLabel}>К{c.num}</div>
                </div>
            ))}
            <div className={styles.conductor}><span>🚶</span></div>
        </div>
    )
}

// ── Головний компонент ──────────────────────────────────────
export default function SeatMap({ wagon, selectedSeats, onToggleSeat }) {
    if (!wagon) return null

    const freeCount   = wagon.totalSeats - wagon.bookedSeats.length - selectedSeats.length
    const bookedCount = wagon.bookedSeats.length

    const renderLayout = () => {
        const props = { bookedSeats: wagon.bookedSeats, selectedSeats, onToggle: onToggleSeat }
        if (wagon.type === 'Плацкарт') return <PlatskarLayout {...props} />
        if (wagon.type === 'Купе')     return <KupeLayout {...props} />
        if (wagon.type === 'СВ')       return <SvLayout {...props} />
        return (
            <div className={styles.grid}>
                {Array.from({ length: wagon.totalSeats }, (_, i) => i + 1).map(num => {
                    const isBooked   = wagon.bookedSeats.includes(num)
                    const isSelected = selectedSeats.includes(num)
                    const cls = isBooked ? styles.booked : isSelected ? styles.selected : styles.free
                    return (
                        <button key={num} className={`${styles.seat} ${cls}`}
                                disabled={isBooked} onClick={() => onToggleSeat(num)}>{num}</button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    Вагон {wagon.number}
                    <span className={styles.typeTag}>{wagon.type}</span>
                </h3>
                <div className={styles.stats}>
                    <span className={styles.statFree}>🟢 Вільних: {freeCount}</span>
                    <span className={styles.statBooked}>🔴 Зайнятих: {bookedCount}</span>
                </div>
            </div>
            <div className={styles.legend}>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotFree}`} /> Вільне</span>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotSelected}`} /> Обране</span>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotBooked}`} /> Зайняте</span>
            </div>
            <div className={styles.wagon}>
                <div className={styles.wagonBody}>{renderLayout()}</div>
            </div>
            {selectedSeats.length > 0 && (
                <div className={styles.selectedInfo}>
                    Обрано місця: <strong>{selectedSeats.sort((a,b)=>a-b).join(', ')}</strong>
                </div>
            )}
        </div>
    )
}