import { connect } from 'react-redux';
import ActivityTab from '../../components/ActivityTab';
import { getMainActivities } from '../../reducers/activities';

const mapStateToProps = state => ({
  activityList: getMainActivities(state),
});

export default connect(mapStateToProps)(ActivityTab);
