import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import './Fixed.less';

export default class Fixed extends React.Component<any, any> {

    refs: {
        [key: string]: (Element);
        fixedNode: (HTMLElement);
    }

    constructor () {
        super();
        this.state = {
            default: 0,
            node: null,
            fixed: false
        }
    }

    componentDidMount() {
        const self = this;
        var svg = this.refs.fixedNode;
        document.body.addEventListener("scroll", this.handleShortcuts.bind(this), true)
        this.setState({
            default: svg.getBoundingClientRect().top,
            node: svg
        });
    }

    handleShortcuts() {
        const self = this;
            var svg = this.refs.fixedNode;
            if (svg.getBoundingClientRect().top <= 2) {
            self.setState({
                fixed: true 
            })   
        }
    }

    public render() {

    const self = this;
    const props = self.props;

    let {node, fixed} = self.state;
    let fixedClass = classNames(
        'r-Fixed',
        {'e-fixed' :  (fixed === true)}
    )

    return (
        <div ref="fixedNode" className={fixedClass}>
            {props.children}
        </div>
    )
  }
}