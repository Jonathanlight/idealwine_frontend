import type { NextApiRequest, NextApiResponse } from "next";

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("WWW-authenticate", 'Basic realm="Secure Area"');
  res.statusCode = 401;
  res.end(`Auth Required.`);
};

export default handler;
