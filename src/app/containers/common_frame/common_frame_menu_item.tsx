import * as React from 'react';
import { Link } from 'react-router-dom';
import './common_frame_menu_item.scss';

type Props = {
  level: number,
  path: string,
  selected: boolean,
  titleEn: string,
  titleJp: string,
};

const CommonFrameMenuItem = (props: Props) => {
  const {
    level,
    selected,
    path,
    titleJp,
    titleEn,
  } = props;

  const content = (
    <div>
      <div className="title-jp">
        {titleJp}
      </div>
      <div className="title-en">
        {titleEn}
      </div>
    </div>
  );

  if (selected) {
    return (
      <div className="common-frame-menu-item">
        <div className={`menu-button level${level} marked`}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="common-frame-menu-item">
      <Link
        to={path}
        className={`menu-button level${level}`}
      >
        {content}
      </Link>
    </div>
  );
};

export { CommonFrameMenuItem };
