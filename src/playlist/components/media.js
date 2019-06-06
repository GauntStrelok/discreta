import React ,{Component} from "react";
import PropTypes from "prop-types";
import "./media.css";
import TitleImage from "../images/components/TitleImage";

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
    author: this.props.author,
    title: this.props.title,
    time: 0
  }
  static propTypes = {
    title: PropTypes.string.isRequired
  };
  componentDidMount() {
    this.timerID = setInterval(
      () => {
        this.setState({time: this.state.time+1});
        //console.log(this.state.author + " - " + this.state.time)
      },
      1000
    );
  }
  handleClick = (evt) => {
    console.log(this.props.title);
    var newAuthor = this.oldAuthor || "carlos perez";
    this.oldAuthor = this.state.author;
    this.setState({
      author: newAuthor
    })
  }
  render() {
    const styles = {

    }
    return (
      <div className="Media" onClick={this.handleClick}>
        <TitleImage src={this.props.imgSrc} alt={this.props.alt || 'Alternativo'} width={260} height={160}>
          <h1>{this.state.title}</h1>
        </TitleImage>
        <p>{this.state.author}</p>
        <div>{this.props.children}</div>
      </div>
    )
  }
}

export default Media;
