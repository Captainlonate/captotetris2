import express, { Request, Response } from 'express'

// ========================================================

const router = express.Router()

// The top-most route 'abcd.com/'
router.get('/', (req: Request, res: Response) => {
  res.send('Captotetris2 API - By Captainlonate')
})

export default router
