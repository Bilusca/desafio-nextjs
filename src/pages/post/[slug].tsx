import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format, isEqual } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { Comments } from '../../components/UtterancesComments';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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

interface NavigationLink {
  title: string;
  uid: string;
}
interface PostProps {
  post: Post;
  preview: boolean;
  nextLink: null | NavigationLink;
  previousLink: null | NavigationLink;
}

export default function Post({
  post,
  preview,
  nextLink,
  previousLink,
}: PostProps) {
  const { isFallback } = useRouter();

  const rawText = post?.data.content.reduce((text, currentText) => {
    const textReading = RichText.asText(currentText.body);

    return `${text} ${textReading}`;
  }, '');

  const timeReading = rawText && Math.ceil(rawText.split(' ').length / 200);

  const checkLastEdit = isEqual(
    new Date(post?.first_publication_date),
    new Date(post?.last_publication_date)
  );

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
                {!checkLastEdit && (
                  <div className={styles.lastEdit}>
                    <p>
                      * editado{' '}
                      {format(
                        new Date(post.last_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR,
                        }
                      )}
                      , às{' '}
                      {format(new Date(post.last_publication_date), 'HH:mm', {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                )}
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
          <hr className={styles.divider} />
          <div className={styles.links}>
            {previousLink && (
              <Link href={previousLink.uid}>
                <a>
                  <p>{previousLink.title}</p>
                  <strong>Post anterior</strong>
                </a>
              </Link>
            )}
            {nextLink && (
              <Link href={nextLink.uid}>
                <a className={styles.nextLink}>
                  <p>{nextLink.title}</p>
                  <strong>Próximo post</strong>
                </a>
              </Link>
            )}
          </div>
          <Comments />
          {preview && (
            <aside className={commonStyles.exitPreview}>
              <Link href="/api/exit-preview">
                <a>Sair do modo Preview</a>
              </Link>
            </aside>
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
    { pageSize: 3 }
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

const verifyLinks = (response, slug): null | NavigationLink => {
  if (response.results.length === 0) {
    return null;
  }
  return response.results[0].uid === slug
    ? null
    : { title: response.results[0].data.title, uid: response.results[0].uid };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const previousResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.title'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const nextResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.title'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const previousLink = verifyLinks(previousResponse, slug);
  const nextLink = verifyLinks(nextResponse, slug);

  return {
    props: {
      post: response,
      preview,
      nextLink,
      previousLink,
    },
  };
};
