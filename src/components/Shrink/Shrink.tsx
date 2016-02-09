import * as React from 'react';
import classNames from 'classnames';
import './Shrink.less';

export default class Shrink extends React.Component<any, any>{
  public render() {
    const self = this;
    const props = self.props;

    let shrinkClass = classNames(
      'r-Shrink',
      {'e-shrink': (props.if)}
    );

    return (
      <div className={shrinkClass}>
        {props.children}
      </div>
    );
  }
}
