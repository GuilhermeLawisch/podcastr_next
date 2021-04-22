import styles from './styles.module.scss';

import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";

import Link from "next/link";

export function Header() {
  const currentData = format(new Date(), 'EEEEEE, d MMM', { locale: ptBR })

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="logo Podcastr"/>
        </a>
      </Link>

      <p>O melhor para você ouvir sempre</p>

      <span>{currentData}</span>
    </header>
  )
}
