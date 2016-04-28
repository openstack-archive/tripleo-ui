import React from 'react';
import { Link } from 'react-router';

export default class StickyFooter extends React.Component {
  render() {
    return (
      <footer className="sticky_footer">
        <Link to="status"><span key="status" className="pficon pficon-cluster"></span></Link>
      </footer>
    );
  }
}
