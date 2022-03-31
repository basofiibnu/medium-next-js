import React from 'react';

const Main = () => {
  return (
    <div className="border-y border-black bg-yellow-400">
      <div className="mx-auto max-w-7xl ">
        <div className="flex items-center justify-between py-10 lg:py-0">
          <div className="basis-3/3 space-y-5 px-10 md:basis-2/3">
            <h1 className="max-w-xl font-serif text-[2.25rem] leading-tight md:text-4xl lg:text-6xl">
              <span className="underline decoration-black decoration-4">
                Medium
              </span>{' '}
              is a place to write, read, and connect
            </h1>
            <h2>
              It's easy and free to post your thinking on any topic
              and connect with millions of readers
            </h2>
          </div>

          <img
            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
            alt="main-logo"
            className="hidden basis-1/3 md:inline-flex md:h-auto md:w-8 lg:h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
