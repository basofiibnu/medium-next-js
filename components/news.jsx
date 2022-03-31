import React, { useEffect, useState } from 'react';

const News = () => {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const [articles, setArticles] = useState([]);

  useEffect(async () => {
    const baseUrl = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;

    const response = await fetch(baseUrl);
    const data = await response.json();

    setArticles(data.articles);
  }, []);

  return (
    <div className="flex-shrink-0 basis-2/3">
      {articles.map((article, i) => (
        <div className="my-10 cursor-pointer px-6" key={i}>
          <a
            href={article.url}
            target="_blank"
            className="text-decoration-none"
          >
            <div className="flex items-center gap-6">
              <div className="basis-4/4 flex flex-col md:basis-3/4">
                <div className="mb-2 flex items-center justify-start gap-2">
                  <img
                    src={article.urlToImage}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <p className="text-xs font-medium">
                    {article.author}
                  </p>
                </div>
                <div className="mb-1 text-xl font-bold md:text-2xl">
                  {article.title}
                </div>
                <div className="font-sm mb-2 text-gray-400">
                  {article.description.slice(0, 70)}...
                </div>
                <div className="flex items-center justify-start gap-1">
                  <p className="text-xs font-medium text-gray-400">
                    {`${new Date(article.publishedAt).toLocaleString(
                      'default',
                      { month: 'short' },
                    )} ${new Date(
                      article.publishedAt,
                    ).getDate()}`}{' '}
                    •
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    6 Min Read •
                  </p>
                  <p className="cursor-pointer rounded-full bg-gray-100 py-1 px-2 text-xs font-medium text-gray-400 transition-all duration-150 ease-in-out hover:bg-gray-200">
                    Typography
                  </p>
                </div>
              </div>
              <div className="hidden basis-1/4 md:block">
                <img src={article.urlToImage} alt="" />
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default News;
