import { mockUsers } from '../../mocks/data';
import styles from './Settings.module.css';

/*
  REACT CONCEPT: Simple Component
  ---------------------------------
  Este componente muestra la info del usuario.
  Por ahora usa mock data. Luego conectaremos
  la query "profile" de GraphQL.
*/

export function Settings() {
  const user = mockUsers[0]; // Simula el usuario logueado

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.profileCard}>
        <img className={styles.avatar} src={user.avatar} alt={user.fullName} />

        <div className={styles.info}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <p className={styles.value}>{user.fullName}</p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <p className={styles.value}>{user.email}</p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <p className={styles.value}>{user.type}</p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Created At</label>
            <p className={styles.value}>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Updated At</label>
            <p className={styles.value}>
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
