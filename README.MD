# Hexo extract images

Download all non local images, save them to disk and change markdown links.

## Usage

```bash
npm install
npm run build
npm start -- --inputDir /web/my/articles/source/_posts/
```

## Options
```bash
npm start -- --help

Options:
      --version   Show version number                                  [boolean]
  -i, --inputDir                                             [string] [required]
  -r, --replace   replace links to remote images with local
                                                       [boolean] [default: true]
  -d, --download  download remote images               [boolean] [default: true]
      --help      Show help                                            [boolean]
```
