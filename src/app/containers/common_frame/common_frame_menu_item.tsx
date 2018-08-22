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

  return (
    <div className="common-frame-menu-item">
      <Link
        to={path}
        className={[`level${level}`, selected ? 'marked' : ''].join(' ')}
      >
        <div className="title-jp">
          {titleJp}
        </div>
        <div className="title-en">
          {titleEn}
        </div>
      </Link>
    </div>
  );
};

export { CommonFrameMenuItem };
