import favicons from 'favicons'
import fs from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'

export default async () => {
  const pkg = await readFile('package.json').then(json => JSON.parse(String(json))).catch(() => null)
  return new Promise((resolve, reject) =>
    favicons(
      path.resolve(process.cwd(), 'src', 'public', 'favicon.svg'),
      {
        path: '/',
        appName: pkg.name,
        appShortName: pkg.name,
        appDescription: pkg.description,
        developerName: pkg.author.name,
        developerURL: pkg.author.github.url,
        background: pkg.color,
        theme_color: pkg.color,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: false,
          windows: true,
          yandex: false,
        },
        logging: true,
      },
      async (error, { files, images }) => {
        if (error) return reject(error)
        await Promise.all(
          [...images, ...files].map(({ name, contents }) =>
            fs.writeFile(path.resolve(process.cwd(), 'public', name), contents, reject)
          )
        )
        return resolve(null)
      }
    )
  )
}
