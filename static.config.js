import path from 'path'
import axios from 'axios'
import React from 'react'

export default {
  Document: ({
    html,
    head,
    body,
    children,
    state: { siteData, renderMeta },
  }) => (<html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Normal Map Generator created for ICSI 418Y at UAlbany, Spring 2022"
        />
        <link rel="apple-touch-icon" href="logo192.png" />
        
        <link rel="manifest" href="manifest.json" />
        
        <title>Normal Map Generator</title>        

      </head>
      <body>
        {children}
        <script src="opencv.js" type="text/javascript"></script>
      </body>
    </html>),
  entry: 'index.js',
  paths: {
    root: process.cwd(), // The root of your project. Don't change this unless you know what you're doing.
    src: 'src', // The source directory. Must include an index.js entry file.
    temp: 'tmp', // Temp output directory for build files not to be published.
    devDist: 'tmp/dev-server', // The development scratch directory.
    public: 'public', // The public directory (files copied to dist during build)
    buildArtifacts: 'artifacts', // The output directory for generated (internal) resources
  },
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    return [
      {
        path: '/blog',
        getData: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          template: 'src/containers/Post',
          getData: () => ({
            post,
          }),
        })),
      },
    ]
  },
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
