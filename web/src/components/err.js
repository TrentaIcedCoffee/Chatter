import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  err: state.err
});

class Err extends React.Component {
  render = () => {
    const { err } = this.props;
    return (
      <div>
        {err}
      </div>
    );
  };
}

export default connect(mapStateToProps, {})(Err);
