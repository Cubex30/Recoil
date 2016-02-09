import * as React from 'react';
import classNames from 'classnames';
import './Selectable.less';

class Selectable extends React.Component<ISelectableProps, ISelectableState> {

  public static defaultProps = {
    type: 'primary'
  }

  render() {
    const self = this;
    const props = self.props;

    let selectableClass = classNames(
      'r-Selectable',
      {'checked' : (props.checked)}
    );

    let borderPartial = (!props.ghost ? <div><div className='r-Selectable__border-gray'></div><div className={'r-Selectable__border '+props.type}></div></div> : null);

    return (
      <div className={selectableClass}>
        {props.children}
        {borderPartial}
      </div>
    );
  }
}

export default Selectable;
