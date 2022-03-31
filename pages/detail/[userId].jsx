import Head from 'next/head'
import React, { useState, useEffect, Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { PuffLoader } from 'react-spinners'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

import Header from '../../components/headers'
import { client } from '../../lib/client'
import Posts from '../../components/posts'
import Footer from '../../components/footer'

const DetailUser = () => {
  const [post, setPost] = useState([])
  const [author, setAuthor] = useState([])
  const [category, setCategory] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [createArticle, setCreateArticle] = useState(false)
  const [image, setImage] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitData, setSubmitData] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]

      setImage(i)
      setCreateObjectURL(URL.createObjectURL(i))
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setSubmitData(true)
    const body = new FormData()
    body.append('file', image)
    const upload = await fetch('/api/upload', {
      method: 'POST',
      body,
    })
    const uploadResponse = await upload.json()

    const insertArticle = await fetch('/api/createArticle', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const insertResponse = await insertArticle.json()

    const patchData = {
      id: insertResponse.data,
      filename: uploadResponse.data.file.originalFilename,
    }

    const patchImage = await fetch('/api/uploadImage', {
      method: 'POST',
      body: JSON.stringify(patchData),
    })
    await patchImage.json()

    await fetchPost(router.query.userId)

    setSubmitted(true)
    setSubmitData(false)
  }

  const randomBg = [
    'https://images.unsplash.com/photo-1523292864699-4dcfd824dae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1542966336-22953b5f7404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80',
    'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1585150610755-fd1086e5be36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80',
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  ]
  const randomIndex = Math.floor(Math.random() * randomBg.length)
  const selectedPicture = randomBg[randomIndex]

  const fetchPost = async (userId) => {
    const postQuery = `*[_type == 'posts' && author._ref == '${userId}']{
      _id,
      _createdAt,
      title,
      author -> {
          image,
          name,
          slug,
          _rev
      },
      description,
      mainImage,
      slug,
    }`
    const postData = await client.fetch(postQuery)
    setPost(postData)
  }

  const fetchAuthor = async (authorId) => {
    const authorQuery = `*[_type == 'author' && _id == '${router.query.userId}'][0]{
      _id,
      image,
      name,
      googleId,
      bio,
      slug
    }`
    const authorData = await client.fetch(authorQuery)
    setAuthor(authorData)
  }

  const fetchCategory = async () => {
    const categoryQuery = `*[_type == 'category']{
      title,
      _rev,
      _id
    }`

    const categoryData = await client.fetch(categoryQuery)
    setCategory(categoryData)
  }

  useEffect(() => {
    if (status !== 'loading') {
      if (!session && status !== 'authenticated') {
        router.push('/')
      }
    }
  }, [session, status])

  useEffect(async () => {
    setLoading(true)

    if (router.query) {
      await fetchPost(router.query.userId)
      await fetchAuthor(router.query.userId)
      await fetchCategory()
    }

    setLoading(false)
  }, [router])

  return (
    <div>
      <Fragment>
        <Head>
          <title>Medium - {author?.name}</title>
          <link rel="icon" href="/logo.webp" />
        </Head>
        <div>
          <Header />
          <div style={{ background: `url(${selectedPicture})` }}>
            <div className="bg-black/30 text-center">
              <div className="mx-auto max-w-5xl text-white">
                <div className="py-10">
                  {loading && <PuffLoader size={100} color={'#9CA3AF'} />}
                  {!loading && author !== null && (
                    <Fragment>
                      <div className="mb-5 w-full">
                        <img
                          src={author?.image}
                          className="mx-auto rounded-full"
                        />
                      </div>

                      <p className="text-3xl font-semibold">{author?.name}</p>
                      <span className="font-semibold text-gray-200">
                        @{author?.slug}
                      </span>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading && category.length === 0 && (
            <div className="mx-auto mb-10 flex min-h-[400px] max-w-2xl flex-col items-center justify-center py-3 px-5">
              <PuffLoader size={100} color={'#9CA3AF'} />
            </div>
          )}

          {!loading && category.length > 0 && (
            <div className="mx-auto my-5 min-h-screen max-w-7xl lg:my-10">
              <div className="mb-5 flex flex-row items-center justify-between border-b p-4 text-2xl font-semibold uppercase text-gray-700">
                <p>{createArticle ? 'Create New Article' : 'Your Articles'}</p>
                <motion.div
                  animate={{
                    rotate: createArticle ? 90 : 0,
                  }}
                  onClick={() => setCreateArticle(!createArticle)}
                >
                  <AiOutlinePlusCircle
                    width={20}
                    height={20}
                    className="cursor-pointer transition-all duration-100 ease-in-out hover:text-black"
                  />
                </motion.div>
              </div>

              {!createArticle && (
                <AnimatePresence>
                  <motion.div
                    className="post-container"
                    layout
                    key="article-post"
                    initial={{
                      opacity: 0,
                      y: 100,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      type: 'tween',
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                    exit={{
                      opacity: 0,
                      x: -200,
                    }}
                  >
                    {post ? (
                      <Posts posts={post} borderBottom={false} />
                    ) : (
                      `You haven't created any articles yet'`
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
              {createArticle && (
                <div className="mx-auto">
                  {submitted ? (
                    <motion.div
                      layout
                      key={'submittedArticle'}
                      initial={{
                        opacity: 0,
                        y: 100,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        type: 'tween',
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}
                      exit={{
                        opacity: 0,
                        y: -200,
                      }}
                      className="mx-auto my-10 flex max-w-2xl flex-col bg-green-700 py-10 text-center text-white"
                    >
                      <h3 className="text-3xl font-bold">
                        Thank you for submitting your article!
                      </h3>
                      <p
                        className="cursor-pointer transition-all duration-150 ease-in-out hover:text-gray-200"
                        onClick={() => {
                          setSubmitted(false)
                          setCreateArticle(false)
                        }}
                      >
                        To view your article list, please click here.
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        layout
                        key={'createArticle'}
                        initial={{
                          opacity: 0,
                          y: 100,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          type: 'tween',
                          duration: 0.5,
                          ease: 'easeInOut',
                        }}
                        exit={{
                          opacity: 0,
                          y: -200,
                        }}
                      >
                        {submitData && (
                          <div className="mx-auto mb-10 flex min-h-[400px] max-w-2xl flex-col items-center justify-center py-3 px-5">
                            <PuffLoader size={100} color={'#9CA3AF'} />
                            <p className="mt-5 text-lg font-semibold text-gray-500">
                              Please wait while we're submitting your article
                            </p>
                          </div>
                        )}
                        {!submitData && (
                          <form
                            className="mx-auto mb-10 flex max-w-2xl flex-col py-3 px-5"
                            onSubmit={handleSubmit(onSubmit)}
                          >
                            <input
                              type="hidden"
                              {...register('_author')}
                              name="author"
                              value={author._id}
                            />
                            <label className="mb-5 block">
                              <span className="text-gray-700">Title</span>
                              <input
                                {...register('title', {
                                  required: true,
                                })}
                                name="title"
                                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-gray-300"
                                type="text"
                                placeholder="Your article title"
                              />
                            </label>
                            <label className="mb-5 block">
                              <span className="text-gray-700">Description</span>
                              <input
                                {...register('description', {
                                  required: true,
                                })}
                                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-gray-300"
                                type="text"
                                placeholder="Article Description"
                              />
                            </label>
                            <label className="mb-5 block">
                              <span className="text-gray-700">Category</span>
                              <select
                                {...register('_category', {
                                  required: true,
                                })}
                                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-gray-300"
                                placeholder="Article Description"
                              >
                                {category.map((item, i) => (
                                  <option value={item._id} key={i}>
                                    {item.title}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="mb-5 block">
                              {createObjectURL && (
                                <div className="mb-5 h-[200px] rounded-md bg-gray-100 p-5">
                                  <img
                                    src={createObjectURL}
                                    alt="main-image"
                                    className="mx-auto h-full w-auto"
                                  />
                                </div>
                              )}
                              <span className="text-gray-700">
                                Article Image
                              </span>
                              <input
                                {...register('mainImg', {
                                  required: true,
                                })}
                                onChange={uploadToClient}
                                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-gray-300"
                                type="file"
                                placeholder="Main Image"
                              />
                            </label>
                            <label className="mb-5 block">
                              <span className="text-gray-700">Content</span>
                              <textarea
                                {...register('content', {
                                  required: true,
                                })}
                                className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none focus:ring focus:ring-gray-300"
                                placeholder="Type your article content here..."
                                rows={8}
                              />
                            </label>

                            <div className="flex flex-col pt-0 pl-5 pb-5 pr-5">
                              {errors.title && (
                                <span className="text-red-500">
                                  The title field is required
                                </span>
                              )}
                              {errors.description && (
                                <span className="text-red-500">
                                  The description field is required
                                </span>
                              )}
                              {errors._category && (
                                <span className="text-red-500">
                                  The category field is required
                                </span>
                              )}
                              {errors.mainImg && (
                                <span className="text-red-500">
                                  The main image field is required
                                </span>
                              )}
                              {errors.content && (
                                <span className="text-red-500">
                                  The content field is required
                                </span>
                              )}
                            </div>

                            <div className="w-full">
                              <input
                                type="submit"
                                className="focus:shadow-outline w-full cursor-pointer rounded bg-gray-400 py-2 px-4 font-bold text-white shadow transition-all duration-150 ease-in-out hover:bg-gray-500 focus:outline-none"
                              />
                            </div>
                          </form>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </Fragment>
    </div>
  )
}

export default DetailUser
