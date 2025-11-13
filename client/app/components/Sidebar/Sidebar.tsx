'use client';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  users: string[];
  isConnected: boolean;
}

export default function Sidebar({ users, isConnected }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <h2>
        En ligne <span className={styles.onlineCount}>{users.length}</span>
      </h2>

      <div className={styles.usersList}>
        {users.map((user, index) => (
          <div key={index} className={styles.userItem}>
            <div className={styles.statusDot}></div>
            <span className={styles.username}>{user}</span>
          </div>
        ))}
      </div>

      <div className={styles.connectionStatus}>
        <div
          className={`${styles.statusIndicator} ${
            isConnected ? styles.connected : styles.disconnected
          }`}
        ></div>
        <span>{isConnected ? 'Connecté' : 'Déconnecté'}</span>
      </div>
    </div>
  );
}
