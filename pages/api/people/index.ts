import { NextApiResponse, NextApiRequest } from 'next'
import { people } from '../../../data'
import { Person } from '../../../interfaces'

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Person[]>
) {
  console.log('test');
  return res.status(200).json(people)
}
