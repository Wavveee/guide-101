import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TAGS } from '../../constants/tags';
import styles from './tags-widget.module.css';

export function TagsWidget() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag');

  const handleTagClick = (slug) => {
    if (activeTag === slug) {
      setSearchParams({}); 
    } else {
      setSearchParams({ tag: slug });
    }
  };

  return (
    <div className={styles.tagsContainer}>
      <h4>Категорії та жанри</h4>
      <div className={styles.tagsList}>
        {TAGS.map(tag => (
          <div 
            key={tag.id} 
            className={`${styles.tagCard} ${activeTag === tag.slug ? styles.active : ''}`}
            onClick={() => handleTagClick(tag.slug)}
          >
            <span className={styles.tagName}>{tag.name}</span>
            <p className={styles.tagDesc}>{tag.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}