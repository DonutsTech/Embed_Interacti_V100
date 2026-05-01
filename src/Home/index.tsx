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
import style from './style.module.scss';

interface HomeProps {
  data: ICampaign;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  const { liberary, client, setClient } = useContext(StatusContext);

  const divRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const [timeVideo, setTimeVideo] = useState<number>(0);
  const [timeVideoAll, setTimeVideoAll] = useState<number>(0);

  const [current, setCurrent] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(true);

  const [play, setPlay] = useState<boolean>(false);

  const fristVideo = data.CAMPAIGN_VIDEOS.find((c) => c.ORDER === 1);

  useEffect(() => {
    const embed = divRef.current;

    if (!embed) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            socket.emit('view', client);
            socket.off('view');
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(embed);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!current) {
      setCurrent(fristVideo?.VIDEO.ID);
    }
  }, [data]);

  useEffect(() => {
    if (play && timeVideoAll > 0) {
      const newClient = { ...client, TIMESCREEN: timeVideoAll };
      socket.emit('timescreen', newClient);

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
      setTimeVideoAll((prev) => prev + currentTime);
    }
  };

  const handleVideoEnd = (videoId: string) => {
    if (videoId !== current) return;

    const currentVideo = data.CAMPAIGN_VIDEOS.find((c) => c.VIDEO.ID === current)?.BONDS.find(
      ({ BOND }) => BOND.BUTTON === false,
    );

    if (currentVideo && currentVideo.BOND.VIDEO_ID) {
      setCurrent(currentVideo.BOND.VIDEO_ID);
      setTimeVideo(0);
      socket.emit('continuity_click_video', currentVideo.BOND.ID);
      socket.off('continuity_click_video');
      videoRefs.current[currentVideo.BOND.VIDEO_ID].muted = false;
      videoRefs.current[currentVideo.BOND.VIDEO_ID].play().catch(console.error);
    }
  };

  return (
    <>
      {data.FEATURE && data.FEATURE.GANCHO && data.FEATURE.GANCHO.ATIVE && (
        <div className={style.headlineBox}>
          <h1
            className={style.ganchoTitle}
            style={{
              ...titleStyle(JSON.parse(data.FEATURE.GANCHO.TITLE_STYLE)),
            }}
          >
            {data.FEATURE.GANCHO.TITLE}
          </h1>
          <p
            className={style.ganchoSubTitle}
            style={{
              ...subTitleStyle(JSON.parse(data.FEATURE.GANCHO.SUBTITLE_STYLE)),
            }}
          >
            {data.FEATURE.GANCHO.SUBTITLE}
          </p>
        </div>
      )}
      <div className={style.embed}>
        {!isPlaying && (
          <div className={style['embed-play-overlay']} onClick={() => handleVideoStart()}>
            <FontAwesomeIcon icon={faPlay} />
          </div>
        )}
        {started || liberary ? (
          <>
            {data.CAMPAIGN_VIDEOS.map((c) => {
              const cta: ctaStyle = JSON.parse(c.CTA_STYLE || '{}');
              const bonds = c.BONDS.filter(({ BOND }) => BOND.BUTTON === true);

              return (
                <div ref={divRef} key={c.ID}>
                  {isPlaying && current === c.VIDEO_ID && <CustomVolume videoRef={videoRefs.current[c.VIDEO_ID]} />}
                  <video
                    id={c.VIDEO.ID}
                    ref={(el) => {
                      if (el) videoRefs.current[c.VIDEO.ID] = el;
                    }}
                    src={c.VIDEO.URL}
                    muted
                    preload="metadata"
                    style={{
                      position: 'absolute',
                      opacity: current === c.VIDEO.ID ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onEnded={() => handleVideoEnd(c.VIDEO.ID)}
                    onClick={() => handleVideoStart()}
                    onTimeUpdate={() => handleTimeUpdate()}
                    controls={false}
                    disablePictureInPicture
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
                          className={style.timeLine}
                          style={{
                            width: `${(timeVideo / c.VIDEO.DURATION) * 100}%`,
                            height: `${data.FEATURE.TIMELINE.HEIGHT}px`,
                            backgroundColor: `${data.FEATURE.TIMELINE.COR}`,
                          }}
                        />
                      )}
                      <div style={{ width: '100%', height: '100%' }}>
                        {c.CTA && (
                          <div className={style['embed-div']} style={{ ...divStyle(cta) }}>
                            <p style={{ ...pStyle(cta) }}>{c.CTA_TEXT}</p>
                            <button
                              className={style['embed-btn']}
                              style={{ ...btnStyle(cta) }}
                              onClick={() => {
                                socket.emit('cta_click_video', c.ID);
                                socket.off('cta_click_video');
                                window.open(c.CTA_URL || '', '_blank');
                              }}
                            >
                              {cta.buttonText || 'Saiba mais'}
                            </button>
                          </div>
                        )}
                        {bonds.map(({ BOND, ID }) => (
                          <button
                            key={ID}
                            className={style['embed-btnedge']}
                            style={{
                              ...btnEdgeStyle(JSON.parse(BOND.BUTTON_STYLE || '{}')),
                              display: BOND.BUTTON_START ? 'block' : 'none',
                            }}
                            onClick={() => {
                              if (BOND.VIDEO_ID) {
                                socket.emit('bond_click_video', BOND.ID);
                                socket.off('bond_click_video');
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
          <div className={style.image} />
        )}
      </div>
      {data.FEATURE &&
        data.FEATURE.EXTERNAL_LINK &&
        data.FEATURE.EXTERNAL_LINK.ATIVE &&
        timeVideoAll >= (JSON.parse(data.FEATURE.EXTERNAL_LINK.STYLE_TEXT || '') as ctaStyleP).delay && (
          <div className={style.ctaBox}>
            <p
              style={{
                ...ctaPStyle(JSON.parse(data.FEATURE.EXTERNAL_LINK.STYLE_TEXT || '')),
              }}
            >
              {data.FEATURE.EXTERNAL_LINK.TEXT}
            </p>
            <button
              className={style.btnCta}
              style={{
                ...ctaBtnStyle(JSON.parse(data.FEATURE.EXTERNAL_LINK.BUTTON_STYLE || '')),
              }}
              onClick={() => {
                if (data.FEATURE?.EXTERNAL_LINK) {
                  socket.emit('external_link_click', data.FEATURE.EXTERNAL_LINK.ID);
                  socket.off('external_link_click');
                  window.open(data.FEATURE.EXTERNAL_LINK.LINK_URL || '', '_blank');
                }
              }}
            >
              {data.FEATURE.EXTERNAL_LINK.BUTTON_TEXT}
            </button>
          </div>
        )}
    </>
  );
};

export default Home;
