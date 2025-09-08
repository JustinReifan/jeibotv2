import fs from 'fs'
import path, { dirname } from 'path'
import assert from 'assert'
import { spawn } from 'child_process'
import syntaxError from 'syntax-error'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Baca package.json secara manual
const packageJsonPath = path.join(__dirname, './package.json')
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

let folders = ['.', ...Object.keys(pkg.directories || {})]
let files = []

for (let folder of folders) {
  const dirPath = path.join(__dirname, folder)
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    for (let file of fs.readdirSync(dirPath).filter(v => v.endsWith('.js'))) {
      files.push(path.resolve(path.join(dirPath, file)))
    }
  }
}

for (let file of files) {
  if (file === __filename) continue
  console.error('Checking', file)
  const error = syntaxError(fs.readFileSync(file, 'utf8'), file, {
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true
  })
  if (error) assert.ok(error.length < 1, file + '\n\n' + error)
  assert.ok(file)
  console.log('Done', file)
}