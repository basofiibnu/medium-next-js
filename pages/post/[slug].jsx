import Head from 'next/head'
import React, { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import PortableText from 'react-portable-text'
import { useForm } from 'react-hook-form'
import { PuffLoader } from 'react-spinners'

import Header from '../../components/headers'
import { client, urlFor } from '../../lib/client'

const PostDetail = () => {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const fetchArticle = async (slug) => {
    setLoading(true)

    const query = `*[_type == 'posts' && slug.current == '${slug}'][0]{
      _id,
      _createdAt,
      title,
      author -> {
          image,
          name
      },
      'comments': *[_type == "comment" && posts._ref == ^._id && approved == true],
      description,
      mainImage,
      slug,
      body,
    }`

    const postData = await client.fetch(query)
    setPost(postData)

    setLoading(false)
  }

  const onSubmit = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        setSubmitted(true)
      })
      .catch((error) => {
        console.log(error)
        setSubmitted(false)
      })
  }

  useEffect(async () => {
    if (router.query) {
      await fetchArticle(router.query.slug)
    }
  }, [router.query])

  return (
    <div>
      <Head>
        <title>Medium - {post?.title}</title>
        <link rel="icon" href="/logo.webp" />
      </Head>
      <div>
        <Header />

        {loading && (
          <div className="mx-auto mb-10 flex min-h-[400px] max-w-2xl flex-col items-center justify-center py-3 px-5">
            <PuffLoader size={100} color={'#9CA3AF'} />
          </div>
        )}
        {!loading && post && (
          <Fragment>
            <img
              src={urlFor(post.mainImage).url()}
              alt="cover-pic"
              className="h-60 w-full object-cover"
            />
            <article className="mx-auto max-w-4xl px-5">
              <h1 className="mt-6 mb-2 text-3xl md:mb-3">{post.title}</h1>
              <h2 className="mb-3 text-xl font-light text-gray-500">
                {post.description}
              </h2>

              <div className="flex items-center space-x-2">
                <img
                  src={post.author.image}
                  className="h-10 w-10 rounded-full"
                  alt="author-pic"
                />
                <p className="text-sm font-extralight">
                  Blog post by{' '}
                  <span className="font-medium text-green-600">
                    {post.author.name}
                  </span>{' '}
                  - Published at {new Date(post._createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-5">
                <PortableText
                  className=""
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                  content={post.body}
                  serializers={{
                    h1: (props) => (
                      <h1 className="my-5 text-2xl font-bold" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="my-5 text-xl font-bold" {...props} />
                    ),
                    li: ({ children }) => (
                      <li className="ml-4 list-disc">{children}</li>
                    ),
                    normal: (props) => <p className="my-3" {...props} />,
                    link: ({ href, children }) => (
                      <a href={href} className="text-blue-500 hover:underline">
                        {children}
                      </a>
                    ),
                  }}
                />
              </div>
            </article>

            {post.comments.length > 0 && (
              <div className="my-10 mx-auto flex max-w-4xl flex-col space-y-2 p-5 shadow shadow-gray-200 md:p-10">
                <h3 className="text-2xl text-gray-700">Comments</h3>
                <hr className="my-2" />

                {post.comments.map((data) => (
                  <div key={data._id}>
                    <p className="flex flex-col border-b-2 py-2">
                      <span className="font-bold">{data.name} :</span>
                      <span className="text-gray-700">{data.comment}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mx-auto max-w-4xl">
              <hr className="my-5 border border-green-600" />
              {submitted ? (
                <div className="mx-auto my-10 flex max-w-2xl flex-col bg-green-600 px-5 py-10 text-center text-white md:px-0">
                  <h3 className="text-3xl font-bold">
                    Thank you for submitting your comment!
                  </h3>
                  <p>Once it has been approved it will appear here</p>
                </div>
              ) : (
                <form
                  className="mx-auto mb-10 flex max-w-2xl flex-col py-3 px-5"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <h3 className="mb-2 text-sm text-yellow-600">
                    Enjoyed this article?
                  </h3>
                  <h4 className="text-3xl font-bold">Leave a comment below</h4>
                  <hr className="mt-2 py-3" />
                  <input
                    type="hidden"
                    {...register('_id')}
                    name="_id"
                    value={post._id}
                  />
                  <label className="mb-5 block">
                    <span className="text-gray-700">Name</span>
                    <input
                      {...register('name', {
                        required: true,
                      })}
                      name="name"
                      className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-blue-300"
                      type="text"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="mb-5 block">
                    <span className="text-gray-700">Email</span>
                    <input
                      {...register('email', {
                        required: true,
                      })}
                      className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-blue-300"
                      type="email"
                      placeholder="Your email"
                    />
                  </label>
                  <label className="mb-5 block">
                    <span className="text-gray-700">Comment</span>
                    <textarea
                      {...register('comment', {
                        required: true,
                      })}
                      className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-blue-300"
                      placeholder="Your comment"
                      rows={8}
                    />
                  </label>

                  <div className="flex flex-col p-5">
                    {errors.name && (
                      <span className="text-red-500">
                        The name field is required
                      </span>
                    )}
                    {errors.email && (
                      <span className="text-red-500">
                        The email field is required
                      </span>
                    )}
                    {errors.comment && (
                      <span className="text-red-500">
                        The comment field is required
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <input
                      type="submit"
                      className="focus:shadow-outline w-full cursor-pointer rounded bg-gray-400 py-2 px-4 font-bold text-white shadow transition-all duration-150 ease-in-out hover:bg-gray-700 focus:outline-none"
                    />
                  </div>
                </form>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default PostDetail
