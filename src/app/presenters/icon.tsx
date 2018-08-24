import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faTimes,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  fab,
} from '@fortawesome/free-brands-svg-icons';

library.add(faTimes);
const CloseIcon = () => (<FontAwesomeIcon icon="times" />);

library.add(faBars);
const MenuIcon = () => (<FontAwesomeIcon icon="bars" />);

library.add(faEnvelope);
const EnvelopeIcon = () => (<FontAwesomeIcon icon="envelope" />);

library.add(fab);
const TwitterIcon = () => (<FontAwesomeIcon icon={['fab', 'twitter']} />);

library.add(fab);
const GitHubIcon = () => (<FontAwesomeIcon icon={['fab', 'github']} />);

export {
  CloseIcon,
  EnvelopeIcon,
  GitHubIcon,
  MenuIcon,
  TwitterIcon,
};
