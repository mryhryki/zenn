import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { Views } from '../../routes';

interface Props {}

interface State {}

class HomeContainer extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <h2>実験プロダクト一覧</h2>
        <ul>
          {Views.map((view) => (
            <li key={view.path}>
              <Link to={view.path}>
                {view.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export { HomeContainer };
