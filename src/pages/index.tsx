import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Post from '../components/Post';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  const fakeData = [...Array(5).keys()].slice(1);

  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>
      <main className={commonStyles.page}>
        <div className={commonStyles.container}>
          {fakeData.map(data => (
            <Post key={data} />
          ))}
          <p className={styles.morePosts}>Carregar mais posts</p>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
