import { connect } from 'react-redux';
import React from 'react';

import Dropdown from '../ui/dropdown/Dropdown';
import DropdownToggle from '../ui/dropdown/DropdownToggle';
import DropdownItem from '../ui/dropdown/DropdownItem';
import I18nActions from '../../actions/I18nActions';


class I18nDropdown extends React.Component {

  render() {
    return (
      <Dropdown>
        <DropdownToggle>
          Language <b className="caret"></b>
        </DropdownToggle>
        <DropdownItem key="lang-en" onClick={this.props.chooseLanguage.bind(this, 'en')}>
          English
        </DropdownItem>
        <DropdownItem key="lang-ja" onClick={this.props.chooseLanguage.bind(this, 'ja')}>
          Japanese
        </DropdownItem>
      </Dropdown>
    );
  }
}

I18nDropdown.propTypes = {
  chooseLanguage: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    chooseLanguage: (language) => dispatch(I18nActions.chooseLanguage(language))
  };
};

export default connect(null, mapDispatchToProps)(I18nDropdown);
