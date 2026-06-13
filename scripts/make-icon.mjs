import { writeFileSync } from 'fs'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const source = 'build/icon-source.png'
const pngOut = 'build/icon.png'

await sharp(source)
  .resize(512, 512, { fit: 'contain', background: { r: 63, g: 78, b: 94, alpha: 1 } })
  .png()
  .toFile(pngOut)

const buf = await pngToIco(pngOut)
writeFileSync('build/icon.ico', buf)
console.log(`Icons ready: ${pngOut}, icon.ico (${buf.length} bytes)`)
