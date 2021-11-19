import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/">
          <a>
            <Image src="/img/Logo.svg" width={238} height={25} alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
