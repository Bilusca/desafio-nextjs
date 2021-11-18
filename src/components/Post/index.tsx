import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './post.module.scss';

export default function Post() {
  return (
    <div className={styles.container}>
      <h3>Como utilizar hooks</h3>
      <p>Pensando em sincronização em vez de ciclos de vida</p>
      <div className={styles.info}>
        <div>
          <FiCalendar />
          <time>15 mar 2021</time>
        </div>
        <div>
          <FiUser />
          <p>Lucas Vieira</p>
        </div>
      </div>
    </div>
  );
}
