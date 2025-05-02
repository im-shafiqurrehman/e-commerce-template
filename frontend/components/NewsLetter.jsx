function NewsLetter() {
  return (
    <div className="bg-[#3321c8] w-full py-12">
      <div className="section text-white flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-balance mb-6">
          <span className="text-[#17dd1f]">Subscribe</span> to get news,
          events, and more
        </h1>

        <div className="w-full max-w-xl">
          <iframe
            data-tally-src="https://tally.so/r/n0Gpe0?transparentBackground=1&hideTitle=1"
            loading="lazy"
            width="100%"
            height="200"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Subscribe Form"
          ></iframe>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          const d = document, w = "https://tally.so/widgets/embed.js";
          if (!d.querySelector(\`script[src="\${w}"]\`)) {
            const s = d.createElement("script");
            s.src = w; s.async = true; d.body.appendChild(s);
          }
        `
      }} />
    </div>
  );
}

export default NewsLetter;
