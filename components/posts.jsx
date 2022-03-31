import Link from 'next/link';
import React from 'react';
import { urlFor } from '../lib/client';

const Posts = ({ posts, borderBottom = true }) => {
  return (
    <div className={`${borderBottom && 'border-b'} border-gray-300`}>
      <div className="mx-auto max-w-7xl">
        <div className="sm: grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-4">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group cursor-pointer overflow-hidden rounded-lg border">
                <img
                  src={urlFor(post.mainImage).url()}
                  alt="content-pic"
                  className="h-60 w-full object-cover transition-transform ease-in-out group-hover:scale-105"
                />
                <div className="flex items-center justify-between bg-white p-5">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={post.author.image}
                    alt="author-pic"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
