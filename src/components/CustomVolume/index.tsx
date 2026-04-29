'use client';

import { faVolume, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

interface CustomVolumeProps {
  videoRef: HTMLVideoElement | null;
}

const CustomVolume = ({ videoRef }: CustomVolumeProps) => {
  const [showSlider, setShowSlider] = useState(false);
  const [volume, setVolume] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef) {
      setVolume(videoRef.volume);
    }
  }, [videoRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef) {
      videoRef.volume = newVolume;
      videoRef.muted = newVolume === 0;
    }
  };

  return (
    <div
      className={styles.volumeContainer}
      ref={containerRef}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
      style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
    >
      <button
        className={styles.volumeButton}
        tabIndex={-1}
        onClick={() => {
          if (!videoRef) return;
          if (videoRef.volume === 0 || videoRef.muted) {
            videoRef.volume = 0.5;
            videoRef.muted = false;
            setVolume(0.5);
          } else {
            videoRef.volume = 0;
            videoRef.muted = true;
            setVolume(0);
          }
        }}
      >
        {volume === 0 ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolume} />}
      </button>
      {showSlider && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
          style={{ marginLeft: 8, width: 80 }}
        />
      )}
    </div>
  );
};

export default CustomVolume;
