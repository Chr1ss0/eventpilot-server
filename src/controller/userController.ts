import { Request, Response } from 'express';

function testFunc(_: Request, res: Response) {
  res.end('Server ist Online');
}

export default testFunc;
