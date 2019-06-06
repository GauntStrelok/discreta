import React ,{Component} from "react";

class Media extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   author: props.author,
    //   title: props.title
    // }
    //this.handleClick = this.handleClick.bind(this);
  }
  state = {

  }
  render() {
    const styles = {

    }
    return (
      <div className="Media">
        {this.props.children}
      </div>
    )
  }
}

export default Media;
