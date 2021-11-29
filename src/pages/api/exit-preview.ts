import { NextApiRequest, NextApiResponse } from 'next';

async function exitPreviewMode(
  _: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.clearPreviewData();

  response.writeHead(307, { Location: '/' });
  return response.end();
}

export default exitPreviewMode;
