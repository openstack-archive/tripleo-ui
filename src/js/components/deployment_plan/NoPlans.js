import { Link } from 'react-router';
import React from 'react';

export default class NoPlans extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className="fa fa-ban"></span>
        </div>
        <h1>No Deployment Plans Available</h1>
        <p>There are no Deployment Plans available. Please create one first.</p>
        <div className="blank-slate-pf-main-action">
          <Link to="/plans/new"
                query={{tab: 'newPlan'}}
                className="btn btn-lg btn-primary">
            <span className="fa fa-plus"/> Create New Plan
          </Link>
        </div>
      </div>
    );
  }
}
