import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter();
  const rawText = post?.data.content.reduce((text, currentText) => {
    const textReading = RichText.asText(currentText.body);

    return `${text} ${textReading}`;
  }, '');

  const timeReading = rawText && Math.ceil(rawText.split(' ').length / 200);

  return (
    <>
      <Head>
        <title>Spacetraveling | Esse post</title>
      </Head>
      <Header />
      {post?.data.banner.url && (
        <div
          className={styles.banner}
          style={{
            backgroundImage: `url(${post.data.banner.url})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
      )}
      <main className={commonStyles.page}>
        <article className={commonStyles.container}>
          {isFallback && <p className={styles.title}>Carregando...</p>}
          {post?.data && (
            <>
              <h1 className={styles.title}>{post.data.title}</h1>
              <div className={styles.infos}>
                <div>
                  <FiCalendar />
                  <time>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                </div>
                <div>
                  <FiUser />
                  <p>{post.data.author}</p>
                </div>
                <div>
                  <FiClock /> <p>{timeReading} min</p>
                </div>
              </div>
              {post.data.content.map(content => (
                <div key={content.heading} className={styles.postContent}>
                  <h3>{content.heading}</h3>
                  {content.body.map((body, index) => (
                    <p key={`text-${index}`}>{body.text}</p>
                  ))}
                </div>
              ))}
            </>
          )}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {}
  );

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: `${post.uid}`,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  return {
    props: {
      post: response,
    },
  };
};
