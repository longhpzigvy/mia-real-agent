import { connect } from 'react-redux';
import TicketReceipt from '../../components/TicketReceipt/TicketReceipt';
import { getCurrentTicket, getTicketById } from '../../selectors/ticket';
import { selectors } from '../../reducers/profile';

const mapStateToProps = (state) => {
  const currentTicketId = getCurrentTicket(state);
  return {
    ticket: getTicketById(state, currentTicketId),
    user: selectors.getProfileFetchedProfile(state),
  };
};

export default connect(mapStateToProps)(TicketReceipt);
