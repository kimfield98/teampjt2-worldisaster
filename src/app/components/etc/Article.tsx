import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Link from 'next/link';

interface ArticleProps {
  dID: string;
}

interface ArticleData {
  headline: string;
  url: string;
  image: string | null;
}

const Article: React.FC<ArticleProps> = ({ dID }) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const [liveResponse, archiveResponse] = await Promise.all([
          axios(`https://worldisaster.com/api/live/${dID}`),
          axios(`https://worldisaster.com/api/archiveNews/${dID}`)
        ]);

        const combinedArticles = [...liveResponse.data, ...archiveResponse.data];
        setArticles(combinedArticles);
        console.log("Log: Articles data loaded successfully");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [dID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div>No articles found.</div>;
  }

  return (
    <Swiper
      pagination={true}
      modules={[Pagination]}
      className="mySwiper"
      slidesPerView={1}
    >
      {articles.map((article, index) => (
        <SwiperSlide className='border-4 rounded-xl border-black mx-auto my-2 mb-7' key={index}>
          <div className="p-4 w-[80%] mx-auto bg-gray-200 shadow-lg rounded-lg overflow-hidden">
            <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
              <div className=' bg-white p-2'>
                <Link className=' text-gray-400 inline' target='_blank' href={article.url} rel="noopener noreferrer">
                  {isNaN(parseInt(dID.charAt(0))) ? (
                    <img
                      src={article.image ? article.image : "https://via.placeholder.com/150x100.png?text=NOIMAGE"}
                      alt="article"
                      className="w-full object-cover"
                    />
                  ) : null}
                </Link>
                <div>
                  <div className="tracking-widest text-xs title-font font-medium mb-1">{article.headline}</div>
                  <div>
                    <Link className='flex items-center text-gray-400' target='_blank' href={article.url} rel="noopener noreferrer">
                      Learn More
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className="swiper-pagination"></div>
    </Swiper>
  );
};

export default Article;