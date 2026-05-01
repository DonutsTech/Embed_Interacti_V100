import type { ICampaign } from '@/@types/campaigns';
import type { ctaStyle, ctaPStyle as ctaStyleP } from '@/@types/embed';
import CustomVolume from '@/components/CustomVolume';
import { StatusContext } from '@/context/StatusContext';
import socket from '@/server';
import {
  btnEdgeStyle,
  btnStyle,
  ctaBtnStyle,
  ctaPStyle,
  divStyle,
  pStyle,
  subTitleStyle,
  titleStyle,
} from '@/utils/functions';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

interface HomeProps {
  data: ICampaign;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  const { liberary, client, setClient } = useContext(StatusContext);

  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const [timeVideo, setTimeVideo] = useState<number>(0);
  const [timeVideoAll, setTimeVideoAll] = useState<number>(0);

  const [current, setCurrent] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(true);

  const [play, setPlay] = useState<boolean>(false);

  const fristVideo = data.CAMPAIGN_VIDEOS.find((c) => c.ORDER === 1);

  useEffect(() => {
    if (!current) {
      setCurrent(fristVideo?.VIDEO.ID);
    }
  }, [data]);

  useEffect(() => {
    console.log('timeVideoAll mudou:', timeVideoAll);

    if (play && timeVideoAll > 0) {
      socket.emit('timescreen', client);

      socket.on('timescreenSuccess', (client) => {
        console.log(client);
        setClient((prev) => ({ ...prev, ID_MODEL_TIME: client.ID_MODEL_TIME }));
      });

      return () => {
        socket.off('timescreenSuccess');
      };
    }
  }, [timeVideoAll]);

  useEffect(() => {
    if (data.FEATURE?.AUTO_PLAY && started) {
      const autoPlayActive = data.FEATURE.AUTO_PLAY.ATIVE;

      if (autoPlayActive && fristVideo) {
        setTimeout(() => {
          videoRefs.current[fristVideo.VIDEO.ID].muted = true;
          videoRefs.current[fristVideo.VIDEO.ID].play().catch(console.error);
        }, 3000);
      }

      if (!autoPlayActive && fristVideo) {
        videoRefs.current[fristVideo.VIDEO.ID].pause();
        videoRefs.current[fristVideo.VIDEO.ID].currentTime = 0;
        setTimeVideo(0);
      }
    }
  }, [data]);

  const handleVideoStart = () => {
    if (!liberary) {
      setStarted(false);
      setIsPlaying(true);
      socket.emit('play_block', client);
      socket.off('play_block');
      return;
    }

    if (!current) return;

    const video = videoRefs.current[current];
    if (!video) return;

    const isPaused = video.paused;

    Object.entries(videoRefs.current).forEach(([id, v]) => {
      if (!v) return;
      if (id !== current) v.pause();
    });

    const currentVideo = data.CAMPAIGN_VIDEOS.find((c) => c.VIDEO.ID === current);

    const tempBolean = currentVideo && currentVideo.VIDEO.DURATION > timeVideo;

    if (!play) {
      socket.connect();
      socket.emit('play', client);
      socket.off('play');
      setPlay(true);
    }

    if (isPaused && tempBolean) {
      video.muted = false;
      video.play().catch(console.error);
      setIsPlaying(true);
    }

    if (!isPaused && tempBolean) {
      video.pause();
      setIsPlaying(false);
    }

    setStarted(false);
  };

  const handleTimeUpdate = () => {
    if (!current) return;

    const video = videoRefs.current[current];

    if (!video) return;

    if (data.FEATURE?.AUTO_PLAY && data.FEATURE.AUTO_PLAY.ATIVE && started) {
      const autoPlaySecond = data.FEATURE.AUTO_PLAY.SECOND;

      if (video.currentTime >= autoPlaySecond) {
        video.currentTime = 0;
        setTimeVideo(0);
        return;
      }
    }

    const currentTime = video.currentTime;

    setTimeVideo(currentTime);
    if (play) {
      setTimeVideoAll((prev) => prev + 1);
    }
  };

  const handleVideoEnd = () => {
    const currentVideo = data.CAMPAIGN_VIDEOS.find((c) => c.VIDEO.ID === current)?.BONDS.find(
      ({ BOND }) => BOND.BUTTON === false,
    );

    if (currentVideo && currentVideo.BOND.VIDEO_ID) {
      setCurrent(currentVideo.BOND.VIDEO_ID);
      setTimeVideo(0);
      videoRefs.current[currentVideo.BOND.VIDEO_ID].muted = false;
      videoRefs.current[currentVideo.BOND.VIDEO_ID].play().catch(console.error);
    }
  };

  return (
    <section>
      {data.FEATURE && data.FEATURE.GANCHO && data.FEATURE.GANCHO.ATIVE && (
        <div className={styles.headlineBox}>
          <h1
            className={styles.ganchoTitle}
            style={{
              ...titleStyle(JSON.parse(data.FEATURE.GANCHO.TITLE_STYLE)),
            }}
          >
            {data.FEATURE.GANCHO.TITLE}
          </h1>
          <p
            className={styles.ganchoSubTitle}
            style={{
              ...subTitleStyle(JSON.parse(data.FEATURE.GANCHO.SUBTITLE_STYLE)),
            }}
          >
            {data.FEATURE.GANCHO.SUBTITLE}
          </p>
        </div>
      )}
      <div className={styles.embed}>
        {!isPlaying && (
          <div className={styles['embed-play-overlay']} onClick={() => handleVideoStart()}>
            <FontAwesomeIcon icon={faPlay} />
          </div>
        )}
        {started || liberary ? (
          <>
            {data.CAMPAIGN_VIDEOS.map((c) => {
              const cta: ctaStyle = JSON.parse(c.CTA_STYLE || '{}');
              const bonds = c.BONDS.filter(({ BOND }) => BOND.BUTTON === true);

              return (
                <div key={c.ID} 
                  className={styles.videoContainer}
                  >
                  {isPlaying && current === c.VIDEO_ID && <CustomVolume videoRef={videoRefs.current[c.VIDEO_ID]} />}
                  <video
                    id={c.VIDEO.ID}
                    ref={(el) => {
                      if (el) videoRefs.current[c.VIDEO.ID] = el;
                    }}
                    src={c.VIDEO.URL}
                    muted
                    preload="metadata"
                    className={styles.video}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transition: 'opacity 0.5s ease-in-out',
                      opacity: current === c.VIDEO.ID ? 1 : 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    onEnded={() => handleVideoEnd()}
                    onClick={() => handleVideoStart()}
                    onTimeUpdate={() => handleTimeUpdate()}
                    controls={false}
                    disablePictureInPicture
                    playsInline
                    controlsList="nodownload nofullscreen noremoteplayback"
                    poster={
                      c.ORDER === 1 &&
                      data.FEATURE &&
                      data.FEATURE.THUMB &&
                      data.FEATURE.THUMB.IMAGE_URL !== '' &&
                      started
                        ? data.FEATURE.THUMB.IMAGE_URL
                        : undefined
                    }
                  >
                    <source src={c.VIDEO.URL} type="video/mp4" />
                  </video>
                  {isPlaying && current === c.VIDEO.ID && !started && (
                    <>
                      {data.FEATURE && data.FEATURE.TIMELINE?.ATIVE && (
                        <div
                          className={styles.timeLine}
                          style={{
                            width: `${(timeVideo / c.VIDEO.DURATION) * 100}%`,
                            height: `${data.FEATURE.TIMELINE.HEIGHT}px`,
                            backgroundColor: `${data.FEATURE.TIMELINE.COR}`,
                          }}
                        />
                      )}
                      <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          overflow: 'hidden',  
                          containerType: 'inline-size'
                          }}>
                        {c.CTA && (
                          <div className={styles['embed-div']} style={{ ...divStyle(cta) }}>
                            <p style={{ ...pStyle(cta) }}>{c.CTA_TEXT}</p>
                            <button
                              className={styles['embed-btn']}
                              style={{ ...btnStyle(cta) }}
                              onClick={() => window.open(c.CTA_URL || '', '_blank')}
                            >
                              {cta.buttonText || 'Saiba mais'}
                            </button>
                          </div>
                        )}
                        {bonds.map(({ BOND, ID }) => (
                          <button
                            key={ID}
                            className={styles['embed-btnedge']}
                            style={{
                              ...btnEdgeStyle(JSON.parse(BOND.BUTTON_STYLE || '{}')),
                            }}
                            onClick={() => {
                              if (BOND.VIDEO_ID) {
                                setCurrent(BOND.VIDEO_ID);
                                setTimeVideo(0);
                                videoRefs.current[BOND.VIDEO_ID].muted = false;
                                if (c.VIDEO_ID) {
                                  videoRefs.current[c.VIDEO_ID].muted = true;
                                }
                                videoRefs.current[BOND.VIDEO_ID].play().catch(console.error);
                              }
                            }}
                          >
                            {BOND.BUTTON_TEXT || 'não definido'}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className={styles.image} />
        )}
      </div>
      {data.FEATURE &&
        data.FEATURE.EXTERNAL_LINK &&
        data.FEATURE.EXTERNAL_LINK.ATIVE &&
        timeVideoAll >= (JSON.parse(data.FEATURE.EXTERNAL_LINK.STYLE_TEXT || '') as ctaStyleP).delay && (
          <div className={styles.ctaBox}>
            <pre
              style={{
                ...ctaPStyle(JSON.parse(data.FEATURE.EXTERNAL_LINK.STYLE_TEXT || '')),
              }}
            >
              {data.FEATURE.EXTERNAL_LINK.TEXT}
            </pre>
            <button
              className={styles.btnCta}
              style={{
                ...ctaBtnStyle(JSON.parse(data.FEATURE.EXTERNAL_LINK.BUTTON_STYLE || '')),
              }}
            >
              {data.FEATURE.EXTERNAL_LINK.BUTTON_TEXT}
            </button>
          </div>
        )}
    </section>
  );
};

export default Home;
