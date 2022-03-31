import React from 'react';

const Footer = () => {
  return (
    <div className="border-t-[1px] border-gray-200">
      <div className="mx-auto my-5 max-w-7xl">
        <div className="mx-5 flex flex-col items-center justify-between md:flex-row">
          <div className="flex cursor-pointer flex-wrap gap-3 text-sm text-gray-400">
            <p className="hover:text-gray-500">Home</p>
            <p className="hover:text-gray-500">About</p>
            <p className="hover:text-gray-500">Contact</p>
            <p className="hover:text-gray-500">Terms</p>
            <p className="hover:text-gray-500">Writer</p>
            <p className="hover:text-gray-500">News</p>
            <p className="hover:text-gray-500">Help</p>
          </div>
          <div className="text-sm text-gray-400">
            <p>@2022 - medium-next - Built for portfolio purpose</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
