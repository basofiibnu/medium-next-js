import Head from 'next/head'
import Header from '../components/headers'
import Main from '../components/main'
import News from '../components/news'
import Posts from '../components/posts'
import Sidebar from '../components/sidebar'
import { client } from '../lib/client'

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Medium Portfolio - NextJS Typescript</title>
        <link rel="icon" href="/logo.webp" />
      </Head>

      <Header />
      <Main />
      {posts && <Posts posts={posts} />}
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-0 lg:flex-row lg:gap-14">
        <News />
        <Sidebar />
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == 'posts']{
    _id,
    title,
    slug,
    author -> {
    name, image
  },
  description,
  mainImage,
  }`

  const posts = await client.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
