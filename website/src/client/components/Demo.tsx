import * as React from 'react';

import createApplication from '../demo/createApplication';
import entry from '../demo/entry';

import { buttonContainerHeights } from '../constants';
import useMedia from '../hooks/useMedia';

const Demo: React.SFC<{}> = () => {
  const columnSize = useMedia(
    ['(min-width: 1000px)', '(min-width: 600px)'],
    ['column-60', ''],
    '',
  );
  const [currentDemo, setCurrentDemo] = React.useState('entry');
  const [applicationCreated, setApplicationCreated] = React.useState(false);

  React.useEffect(() => {
    entry();
  }, []);

  return (
    <div className={`column ${columnSize} flex-center`}>
      <div id="demo" />
      <div
        id="demo-button-container"
        style={{ marginTop: buttonContainerHeights[currentDemo] }}
      >
        {!applicationCreated && currentDemo === 'entry' && (
          <button
            className="button blue-bg"
            id="create-application"
            onClick={(): void =>
              createApplication({ setApplicationCreated, setCurrentDemo })
            }
          >
            Create Application
          </button>
        )}

        {applicationCreated && (
          <button
            className="button blue-bg"
            id="view-documentation"
            onClick={(): void => {
              window.open(
                'https://github.com/alexlee-dev/create-mern-application',
                '_blank',
              );
            }}
          >
            View Documentation
          </button>
        )}
      </div>
    </div>
  );
};

export default Demo;
