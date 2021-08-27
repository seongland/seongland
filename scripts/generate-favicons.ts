import favicons from 'favicons'
import { readFile as read, writeFile as write } from 'fs/promises'
import { resolve as join } from 'path'

export default async () => {
  const pkg = await read('package.json')
    .then(json => JSON.parse(String(json)))
    .catch(() => null)
  return new Promise((resolve, reject) =>
    favicons(
      join('src', 'public', 'favicon.svg'),
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
        const targets = [...images, ...files]
        const promises = targets.map(({ name, contents }) => write(join('public', name), contents))
        await Promise.all(promises)
        return resolve(null)
      }
    )
  )
}
