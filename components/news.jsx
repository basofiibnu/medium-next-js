import React, { useEffect, useState } from 'react'
import { PuffLoader } from 'react-spinners'

const News = () => {
  const apiKey = process.env.NEXT_PUBLIC_RAPID_NEWS_KEY
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    setLoading(true)
    const baseUrl = `https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=id&topic=world&media=true`

    const response = await fetch(baseUrl, {
      headers: {
        'x-rapidapi-host': 'newscatcher.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
    })
    const data = await response.json()

    setArticles(data.articles)
    setLoading(false)
  }, [])

  console.log(articles)

  return (
    <div className="flex-shrink-0 basis-2/3">
      {loading && (
        <div className="mx-auto mb-10 flex min-h-[400px] max-w-2xl flex-col items-center justify-center py-3 px-5">
          <PuffLoader size={100} color={'#9CA3AF'} />
          <p className="mt-5 text-lg font-semibold text-gray-500">
            Please wait while we're fetching your news
          </p>
        </div>
      )}
      {!loading &&
        articles &&
        articles.map((article, i) => (
          <div className="my-10 cursor-pointer px-6" key={i}>
            <a
              href={article.link}
              target="_blank"
              className="text-decoration-none"
            >
              <div className="flex items-center gap-6">
                <div className="basis-4/4 flex flex-col md:basis-3/4">
                  <div className="mb-2 flex items-center justify-start gap-2">
                    <img
                      src={article.media}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <p className="text-xs font-medium">{article.author}</p>
                  </div>
                  <div className="mb-1 text-xl font-bold md:text-2xl">
                    {article.title}
                  </div>
                  <div className="font-sm mb-2 text-gray-400">
                    {article.summary?.slice(0, 70)}...
                  </div>
                  <div className="flex items-center justify-start gap-1">
                    <p className="text-xs font-medium text-gray-400">
                      {`${new Date(article.published_date).toLocaleString(
                        'default',
                        { month: 'short' }
                      )} ${new Date(article.published_date).getDate()}`}{' '}
                      •
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      6 Min Read •
                    </p>
                    <p className="cursor-pointer rounded-full bg-gray-100 py-1 px-2 text-xs font-medium text-gray-400 transition-all duration-150 ease-in-out hover:bg-gray-200">
                      News
                    </p>
                  </div>
                </div>
                <div className="hidden basis-1/4 md:block">
                  <img src={article.media} alt="" />
                </div>
              </div>
            </a>
          </div>
        ))}
    </div>
  )
}

export default News
