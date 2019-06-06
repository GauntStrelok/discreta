import React ,{Component} from "react";

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open || true,
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle(bool) {
    let open = typeof bool === "boolean" ? bool : !this.state.open;
    this.setState({
      open: open
    })
  }

  open() {
    this.setState({
      open: true
    })
  }

  close() {
    this.setState({
      open: false
    })
  }

  render() {
    const styles = { display: this.state.open ? 'block' : 'none', marginLeft: "15px"}
    const titleStyles = {width: "100%"}
    const iconStyle = {fontSize: "14px"}
    return (
      <div>
        <div onClick={this.toggle} style={titleStyles}>
        <span style={iconStyle}>{this.state.open ? '-' : '+'}</span>
        {this.props.title}</div>
        <div style={styles} className="acc" >
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Accordion;
