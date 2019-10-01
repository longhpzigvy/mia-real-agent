import { connect } from 'react-redux';
import ChangeLanguage from '../../components/ChangeLanguage';
import { getSystemLanguage, changeLanguage } from '../../reducers/system';

const mapStateToProps = state => ({
  lngCode: getSystemLanguage(state),
});

const mapDispatchToProps = {
  changeLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLanguage);
