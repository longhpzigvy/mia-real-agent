import { connect } from 'react-redux';
import ProfileUser from 'components/AdminTopNavBar/ProfileUser/ProfileUser';
import {
  actions,
} from '../../reducers/auth';
import { selectors } from '../../reducers/profile';

const mapStateToProps = state => ({
  profile: selectors.getProfileFetchedProfile(state),
});

const mapDispatchToProps = {
  onLogout: actions.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUser);
