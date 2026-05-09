import { Outlet, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
    return (
        <div className={styles.wrapper}>
            <nav className={styles.nav}>
                <span className={styles.logo}>🚂 Укрзалізниця</span>
                <div className={styles.links}>
                    <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>
                        Рейси
                    </NavLink>
                    <NavLink to="/my-bookings" className={({ isActive }) => isActive ? styles.active : ''}>
                        Мої бронювання
                    </NavLink>
                </div>
            </nav>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    )
}