// delete /dist/service/src/static/static and noto.svg
import fs from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

fs.rmSync(path.join(__dirname, '../dist/service/src/static/static'), { recursive: true, force: true })
fs.rmSync(path.join(__dirname, '../dist/service/src/static/noto.svg'), { force: true })
