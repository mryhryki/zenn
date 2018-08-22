import * as React from 'react';
import {
  CloseIcon,
  MenuIcon,
} from '../../presenters/icon';
import { CommonFrameMenuItem } from './common_frame_menu_item';
import './common_frame.scss';

interface Menu {
  path: string,
  titleJp: string,
  titleEn: string,
  level: number
}

interface Props {
  children: Array<React.ReactNode>,
  menuList: Array<Menu>
}

interface State {
  showMenu: boolean,
}

class CommonFrame extends React.Component<Props, State> {
  state: State = { showMenu: false };

  render() {
    const { children, menuList } = this.props;
    const { showMenu } = this.state;

    const currentPath: string = window.location.hash.substr(1);
    return (
      <div id="common-frame">
        <div
          id="common-frame-content"
          className={showMenu ? 'show-menu' : ''}
        >
          <div id="common-frame-content-inner">
            {children}
          </div>
        </div>
        {!showMenu && (
          <button
            className="common-frame-header-menu-button"
            onClick={() => this.setState({ showMenu: true })}
          >
            <MenuIcon />
            <span>Menu</span>
          </button>
        )}
        {showMenu && (
          <div id="common-frame-menu">
            <button
              className="common-frame-header-menu-button"
              onClick={() => this.setState({ showMenu: false })}
            >
              <CloseIcon />
              <span>Close</span>
            </button>
            {menuList.map((menu: Menu) => (
              <CommonFrameMenuItem
                key={menu.path}
                level={menu.level}
                selected={currentPath === menu.path}
                path={menu.path}
                titleJp={menu.titleJp}
                titleEn={menu.titleEn}
              />
            ))}
          </div>
        )}
        <div id="common-frame-footer">
          <div>(C) 2018 hyiromori</div>
        </div>
      </div>
    );
  };
}

export {
  CommonFrame,
};
