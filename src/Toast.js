import React, { Component } from "react";
import PropTypes from "prop-types";

import ProgressBar from "./ProgressBar";
import config from "./config";
import objectValues from "./util/objectValues";
import { falseOrElement, falseOrNumber } from "./util/propValidator";

class Toast extends Component {
  static propTypes = {
    closeButton: falseOrElement.isRequired,
    autoClose: falseOrNumber.isRequired,
    children: PropTypes.node.isRequired,
    closeToast: PropTypes.func.isRequired,
    position: PropTypes.oneOf(objectValues(config.POSITION)).isRequired,
    pauseOnHover: PropTypes.bool.isRequired,
    closeOnClick: PropTypes.bool.isRequired,
    transition: PropTypes.func.isRequired,
    in: PropTypes.bool,
    hideProgressBar: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    type: PropTypes.oneOf(objectValues(config.TYPE)),
    className: PropTypes.string,
    bodyClassName: PropTypes.string,
    progressClassName: PropTypes.string
  };

  static defaultProps = {
    type: config.TYPE.DEFAULT,
    in: true,
    hideProgressBar: false,
    onOpen: null,
    onClose: null,
    className: "",
    bodyClassName: "",
    progressClassName: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      isRunning: true
    };
  }

  componentDidMount() {
    this.props.onOpen !== null && this.props.onOpen(this.getChildrenProps());
  }

  componentWillUnmount() {
    this.props.onClose !== null && this.props.onClose(this.getChildrenProps());
  }

  getChildrenProps() {
    return this.props.children.props;
  }

  getToastProps() {
    const toastProps = {
      className: `toastify-content toastify-content--${this.props.type} ${this
        .props.className}`
    };

    if (this.props.autoClose !== false && this.props.pauseOnHover === true) {
      toastProps.onMouseEnter = this.pauseToast;
      toastProps.onMouseLeave = this.playToast;
    }

    this.props.closeOnClick && (toastProps.onClick = this.props.closeToast);

    return toastProps;
  }

  pauseToast = () => {
    this.setState({ isRunning: false });
  };

  playToast = () => {
    this.setState({ isRunning: true });
  };

  render() {
    const {
      closeButton,
      children,
      autoClose,
      type,
      hideProgressBar,
      closeToast,
      transition,
      position
    } = this.props;

    const Transition = transition;

    return (
      <Transition in={this.props.in} appear unmountOnExit position={position}>
        <div {...this.getToastProps()}>
          <div className={`toastify__body ${this.props.bodyClassName}`}>
            {children}
          </div>
          {closeButton !== false && closeButton}
          {autoClose !== false && (
            <ProgressBar
              delay={autoClose}
              isRunning={this.state.isRunning}
              closeToast={closeToast}
              hide={hideProgressBar}
              type={type}
              className={this.props.progressClassName}
            />
          )}
        </div>
      </Transition>
    );
  }
}

export default Toast;
