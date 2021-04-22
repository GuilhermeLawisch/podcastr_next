import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link"
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { format, parseISO } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR'
import styles from "./home.module.scss";

type EpisodesBeforeRefactoring = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

type EpisodesAfterRefactoring = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
}

type HomeProps = {
  lastestEpisodes: EpisodesAfterRefactoring[];
  allEpisodes: EpisodesAfterRefactoring[];
}

export default function Home({ lastestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.lastestEpisodes}>
        <h2>Últimos episódios</h2>
        <ul>
          {lastestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192} 
                  objectFit="cover"
                  src={episode.thumbnail} 
                  alt={episode.title}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      objectFit="cover"
                      src={episode.thumbnail} 
                      alt={episode.title}
                    />  
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 110 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="./play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })/*('https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c4ea48b9-25ef-4267-aa02-f4815e2a3459/server.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210420T200342Z&X-Amz-Expires=86400&X-Amz-Signature=a4ddfec519a733c39779cc3b72841cadbf6e4bd4ba06575472878eb8cc2dca01&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22server.json%22')*/

  const episodes = data.map((episode:EpisodesBeforeRefactoring) => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const lastestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}
