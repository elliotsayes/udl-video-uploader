interface Props {
  url?: string;
  controls?: boolean;
  darken?: boolean;
}

export const VideoPreview = (props: Props) => {
  const { url, controls, darken } = {
    controls: false,
    darken: false,
    ...props,
  };

  return (
    <div className="relative aspect-video w-72 rounded-md overflow-hidden">
      {
        url ? (
          <video
            src={url} 
            className={`absolute w-full h-full aspect-video object-cover ${(controls !== true) ? 'opacity-60' : ''}`}
            muted
            controls={controls}
            autoPlay={controls}
          />
        ) : (
          <div className="absolute w-full h-full aspect-video opacity-40 bg-gray-200" />
        )
      }
      { 
        !controls && (
          <div className={`absolute w-full h-full bg-gradient-to-b from-gray-800/50 to-gray-800 mix-blend-overlay ${darken ? '' : 'opacity-80'}`} />
        )
      }
    </div>
  )
}