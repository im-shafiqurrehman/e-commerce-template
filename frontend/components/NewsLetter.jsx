function NewsLetter() {
    return (
      <div className="bg-[#3321c8] w-full py-12">
        <div className="section text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-balance">
              <span className="text-[#17dd1f]">Subscribe</span> to get news,
              events, and more
            </h1>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <form className="flex flex-col md:flex-row items-center w-full md:w-auto">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="max-w-sm w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-4 leading-8 mb-4 md:mb-0 md:mr-2"
              />
              <button
                type="submit"
                className="max-w-sm md:w-auto w-full bg-[#17dd1f] text-white px-5 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  export default NewsLetter;  