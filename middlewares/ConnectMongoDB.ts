import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

import { DefaultResponseMessage } from '../types/responses/DefaultResponseMessage';

export const ConnectMongoDb = (handler: NextApiHandler) =>
  async (request: NextApiRequest, response: NextApiResponse<DefaultResponseMessage>) => {

    if (!mongoose.connections[0].readyState) {
      const { DB_CONNECTION_STRING } = process.env;
      if (!DB_CONNECTION_STRING) {
        return response.status(500).json({ msg: 'ENV Database connection not provided' })
      }
      await mongoose.connect(DB_CONNECTION_STRING);
    }

    return handler(request, response);
  }