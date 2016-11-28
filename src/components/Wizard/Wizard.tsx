import * as React from 'react';
import * as classNames from 'classnames';
import './Wizard.less';

export interface IWizardProps {
  slideIndex ? : number;
  vertical ? : boolean;
  className ? : any;
  children ? : any;
  style ? : any;
  mobile? : boolean;
  animate? : boolean;
  fill ? : boolean;
  overflow?: boolean;
  flex?: boolean;
}

const WizardSlide : any = (props : any) => {
  return (
    <div className={props.className}>
      {props.visible ? props.children : null}
    </div>
  );
}

export default class Wizard extends React.Component<IWizardProps, {}>{
  public static defaultProps = {
    slideIndex: 0
  }
  constructor(props) {
    super(props);
  }
  render() {

    const self = this;
    const props = self.props;

    let wizardClass = classNames(
      'r-Wizard',
      { 'e-fill': (props.fill) },
      { 'e-flex': (props.flex) },
      {'e-overflow': (props.overflow)}
    );

    let createSlidesPartial = (item, index) => {

      let selected = props.slideIndex === index;
      let forward = index === props.slideIndex + 1;
      let backward = index === props.slideIndex - 1;

      let wizardSlideClass = classNames(
        'r-WizardSlide',
        {'e-selected' : (props.slideIndex === index)},
        {'e-backward' : (props.slideIndex > index)},
        {'e-forward' : (props.slideIndex < index)},
        {'e-vertical' : (props.vertical)},
        {'e-dont-animate' : (props.animate === false)},
        
        props.className
      );

      return (
          <WizardSlide visible={selected || forward || backward} className={wizardSlideClass} key={index}>
              {item}
          </WizardSlide>
      )
    };

    if (props.children.length > 1) {
      return(
        <div ref="r-Wizard" className={wizardClass} style={props.style}>
          <div ref='r-Wizard__track' className="r-Wizard__track">
            {props.children.map(createSlidesPartial)}
          </div>
        </div>
      );
    } else{
      return props.children;
    }
  }
}
