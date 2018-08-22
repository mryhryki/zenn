import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);
const CloseIcon = () => (<FontAwesomeIcon icon="times" />);

library.add(faBars);
const MenuIcon = () => (<FontAwesomeIcon icon="bars" />);

export {
  CloseIcon,
  MenuIcon,
};
