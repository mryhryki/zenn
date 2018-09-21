import * as React from 'react';
import { Link } from 'react-router-dom';
import { isMobileDevice } from '../../common/platform';
import './index.scss';

import IconClose from '../../icon/close.png';
import IconGitHub from '../../icon/github.png';
import IconMail from '../../icon/mail.png';
import IconMenu from '../../icon/menu.png';
import IconTwitter from '../../icon/twitter.png';

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

  closeMenuIfMobileDevice = (): void => {
    if (isMobileDevice()) {
      this.setState({ showMenu: false });
    }
  };

  renderMenuItem(menu: Menu, selected: boolean) {
    const {
      level,
      path,
      titleJp,
      titleEn,
    } = menu;

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
        <div className={`menu-button level${level} marked`}>
          {content}
        </div>
      );
    }

    return (
      <Link
        to={path}
        className={`menu-button level${level}`}
        onClick={this.closeMenuIfMobileDevice}
      >
        {content}
      </Link>
    );
  }

  render() {
    const { children, menuList } = this.props;
    const { showMenu } = this.state;
    const currentPath: string = `/${window.location.hash.substr(1)}`;

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
        {showMenu ? (
          <div id="common-frame-menu">
            <button
              className="common-frame-header-menu-button"
              onClick={() => this.setState({ showMenu: false })}
            >
              <img src={IconClose} />
              <span>Close</span>
            </button>
            {menuList.map((menu: Menu) => (
              <div
                key={menu.path}
                className="menu-item"
              >
                {this.renderMenuItem(menu, currentPath === menu.path)}
              </div>
            ))}
          </div>
        ) : (
           <button
             className="common-frame-header-menu-button"
             onClick={() => this.setState({ showMenu: true })}
           >
             <img src={IconMenu} />
             <span>Menu</span>
           </button>
         )
        }
        <div id="common-frame-footer">
          <div className="left-content">
            <a
              className="tooltip"
              data-tooltip="Mail"
              href="mailto:hyiromori@gmail.com"
            >
              <img src={IconMail} />
            </a>
            <a
              className="tooltip"
              data-tooltip="Twitter"
              href="https://twitter.com/hyiromori"
              target="_blank"
            >
              <img src={IconTwitter} />
            </a>
            <a
              className="tooltip"
              data-tooltip="GitHub"
              href="https://github.com/hyiromori"
              target="_blank"
            >
              <img src={IconGitHub} />
            </a>
          </div>
          <div className="right-content">(C) 2018 hyiromori</div>
        </div>
      </div>
    );
  };
}

export {
  CommonFrame,
};
