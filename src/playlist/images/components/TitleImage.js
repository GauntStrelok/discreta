import React from 'react';

function TitleImage(props) {
  const {
    src, width, height, alt
  } = props;
  return (
    <div>
      {props.children}
      <img src={src} width={width} height={height} alt={alt}></img>
    </div>

  )
}

export default TitleImage
