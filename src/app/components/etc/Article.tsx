import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
    return <div>No articles found</div>;
  }

  return (
    <div>
      {articles.map((article, index) => (
        <div key={index}>
          <div>
            {isNaN(parseInt(dID.charAt(0))) ? <img src={article.image ? article.image : "https://via.placeholder.com/150x100.png?text=NO IMAGE"} alt="article" /> : null}
            <div>
              <div>{article.headline}</div>
              <div>
                <Link target='_blank' href={article.url}>Learn More
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Article;