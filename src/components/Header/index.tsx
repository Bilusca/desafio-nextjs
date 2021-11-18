import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Image src="/img/Logo.svg" width={238} height={25} alt="logo" />
      </div>
    </header>
  );
}
