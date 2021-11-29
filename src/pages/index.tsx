import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import Post from '../components/Post';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

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
  preview: boolean;
}

export default function Home({ postsPagination, preview }: HomeProps) {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState(postsPagination.results);

  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>
      <Header />
      <main className={commonStyles.page}>
        <div className={commonStyles.container}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <Post post={post} />
              </a>
            </Link>
          ))}
          {nextPage && (
            <button
              onClick={async () => {
                const data = await fetch(nextPage);
                const response = await data.json();

                setNextPage(response.next_page);
                setPosts([...posts, ...response.results]);
              }}
              className={styles.morePosts}
              type="button"
            >
              Carregar mais posts
            </button>
          )}
        </div>
        {preview && (
          <aside className={commonStyles.exitPreview}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

  const results = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: post.data,
  }));

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
      preview,
    },
    revalidate: 60 * 10,
  };
};
