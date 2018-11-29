import * as React from 'react';
import { VideoHTMLAttributes } from 'react';

type VideoAttributes = VideoHTMLAttributes<HTMLVideoElement>;
type Props = VideoAttributes & { srcObject?: MediaStream };

class Video extends React.Component<Props> {
  setVideoElement = (video: HTMLVideoElement) => {
    if (video != null && this.props.srcObject != null) {
      video.srcObject = this.props.srcObject;
    }
  };

  render() {
    const props: Props = { ...this.props };
    delete props.srcObject;

    return (
      <video
        ref={(video) => this.setVideoElement(video)}
        {...props}
      />
    );
  }
}

export { Video };
