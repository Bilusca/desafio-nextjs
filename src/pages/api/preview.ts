import { Document } from '@prismicio/client/types/documents';
import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicClient } from '../../services/prismic';

function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

async function previewMode(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const { token: ref, documentId } = request.query as {
    token: string;
    documentId: string;
  };

  const redirectUrl = await getPrismicClient(request)
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return response.status(401).json({ message: 'Invalid token' });
  }

  response.setPreviewData({ ref });

  response.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
    <script>window.location.href = '${redirectUrl}'</script>
    </head>`
  );
  return response.end();
}

export default previewMode;
