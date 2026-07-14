import styles from './LoadingSpinner.module.css';

/*
  LOADING SKELETON
  =================
  ¿Que es? En vez de un spinner generico, mostramos "la forma"
  del contenido que va a cargar. Esto reduce el "layout shift"
  (cuando el contenido aparece y todo se mueve) y hace que la
  carga se sienta mas rapida aunque tome el mismo tiempo.

  Este componente se usa como fallback de Suspense y mientras
  los datos se cargan de la API.
*/

export function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.text}>Loading...</p>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className={styles.board}>
      {Array.from({ length: 5 }).map((_, col) => (
        <div key={col} className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.dot} />
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
          </div>
          {Array.from({ length: col % 3 === 0 ? 1 : 2 }).map((_, row) => (
            <div key={row} className={styles.card}>
              <div className={styles.skeletonLine} style={{ width: '80%', height: '14px' }} />
              <div className={styles.tagRow}>
                <div className={styles.skeletonTag} />
                <div className={styles.skeletonTag} />
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.skeletonLine} style={{ width: '40%', height: '10px' }} />
                <div className={styles.skeletonAvatar} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
