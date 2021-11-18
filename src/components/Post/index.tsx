import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './post.module.scss';

interface PostProps {
  post: {
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  };
}

export default function Post({ post }: PostProps) {
  const date = format(new Date(post.first_publication_date), 'dd MMM yyyy', {
    locale: ptBR,
  });

  return (
    <div className={styles.container}>
      <h3>{post.data.title}</h3>
      <p>{post.data.subtitle}</p>
      <div className={styles.info}>
        <div>
          <FiCalendar />
          <time>{date}</time>
        </div>
        <div>
          <FiUser />
          <p>{post.data.author}</p>
        </div>
      </div>
    </div>
  );
}
