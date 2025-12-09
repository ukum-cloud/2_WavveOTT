import React from 'react';
import { Link } from 'react-router-dom';
import './scss/EditorRecommend.scss';

const EditorRecommendCard = ({ backposter, id, title }) => {
  return (
    <Link
      to={`/detail/${id}`}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="rec-card">
      <img
        src={`http://image.tmdb.org/t/p/w300${backposter}`}
        alt=""
        style={{ width: '100%', borderRadius: '12px' }}
        className="R-b-poster"
      />
      <img
        src={`https://image.tmdb.org/t/p/original${title}`}
        alt=""
        className="R-b-logo"
        style={{
          width: '190px',
          height: '80px',
          position: 'absolute',
          zIndex: '3',
          bottom: '0',

          // objectFit: 'contain',
        }}
      />
    </Link>
  );
};

export default EditorRecommendCard;
