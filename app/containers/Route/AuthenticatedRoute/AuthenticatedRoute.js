import { connect } from 'react-redux';
import AuthenticatedRoute from '../../../components/Route/AuthenticatedRoute';
import { checkAuthenticatedStatus, getUserRole } from '../../../reducers/auth';

const mapStateToProps = state => ({
  authenticated: checkAuthenticatedStatus(state),
  userRole: getUserRole(state),
});

export default connect(mapStateToProps)(AuthenticatedRoute);
