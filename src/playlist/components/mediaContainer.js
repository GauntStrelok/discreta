import React ,{Component} from "react";
import PropTypes from "prop-types";
import Media from "./media";
import "./mediaContainer.css";

class MediaContainer extends Component {
  render() {
    //console.log(this.props.medias);
    return (
      <div>
        {
          this.props.medias.map((el,i) => {
            return <Media {...el} key={i}><p>{this.props.mediasText}</p></Media>
          })
        }
      </div>
    )
  }
}

export default MediaContainer
