/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isPageLoading } from './reducers/system';
import MainLayout from './components/MainLayout';
import LoadingScreen from './components/LoadingScreen';

import AuthenticatedRoute from './containers/Route/AuthenticatedRoute';
import AdminMainLayout from './containers/AdminMainLayout';
import UserManagement from './containers/UserManagement';
import UserDetail from './containers/UserDetail';
import UnauthRoute from './containers/Route/UnauthenticateRoute';
import { RegistrationIndividual, RegistrationBusiness } from './containers/Registration';

import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import LoginCallBackPage from './pages/LoginCallback';
import ThankForRegistering from './pages/ThankForRegistering';
import Profile from './pages/Profile';
import ChatbotComponent from './pages/Chatbot';
import TicketManagement from './pages/TicketManagement';
import TicketDetail from './containers/TicketDetail';
import TicketWarning from './containers/TicketWarning';
import ApplicationManagement from './pages/ApplicationManagement';
import ApplicationDetail from './containers/ApplicationDetail';
import IntentManagement from './pages/IntentManagement';
import FeedbackManagement from './pages/FeedbackManagement';
import CannedResponseManagement from './pages/CannedResponseManagement';

import AdminDashboard from './pages/AdminDashboard';
import ApplicationForm from './pages/Application';
import AdminRoute from './containers/Route/AdminRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EditApplication from './containers/EditApplication/EditApplication';
import System from './pages/System';
import ApplicationReview from './containers/ApplicationReview';
import ChangeRequest from './pages/ChangeRequest';

class Router extends React.PureComponent {
  static propTypes = {
    isPageLoading: PropTypes.bool.isRequired,
  }

  render() {
    const { isPageLoading: isLoading } = this.props;

    if (isLoading) {
      return (
        <LoadingScreen />
      );
    }

    return (
      <Switch>
        <AdminRoute
          path="/admin"
          component={() => (
            <AdminMainLayout>
              <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
              <AdminRoute exact path="/admin/tickets" component={TicketManagement} />
              <AdminRoute path="/admin/tickets-warning/:id?" component={TicketWarning} />
              <AdminRoute path="/admin/tickets/:id" component={TicketDetail} />
              <AdminRoute exact path="/admin/applications" component={ApplicationManagement} />
              <AdminRoute exact path="/admin/applications/:id" component={ApplicationDetail} />
              <AdminRoute exact path="/admin/applications/:id/edit" component={EditApplication} />
              <AdminRoute path="/admin/intents/:id?" component={IntentManagement} />
              <AdminRoute path="/admin/feedbacks/:id?" component={FeedbackManagement} />
              <AdminRoute exact path="/admin/user" component={UserManagement} />
              <AdminRoute path="/admin/user/:id" component={UserDetail} />
              <AdminRoute path="/admin/canned-responses" component={CannedResponseManagement} />
              <AdminRoute path="/admin/system" component={System} />
              <AdminRoute exact path="/admin" component={() => <Redirect to="/admin/user" />} />
            </AdminMainLayout>
          )}
        />
        <UnauthRoute exact path="/" component={HomePage} />
        <UnauthRoute exact path="/login" component={Login} />
        <UnauthRoute exact path="/register" component={Registration} />
        <UnauthRoute exact path="/register/individual" component={RegistrationIndividual} />
        <UnauthRoute exact path="/register/business" component={RegistrationBusiness} />
        <UnauthRoute exact path="/greeting" component={ThankForRegistering} />
        <UnauthRoute exact path="/application" component={ApplicationForm} />
        <UnauthRoute exact path="/forgot" component={ForgotPassword} />
        <UnauthRoute exact path="/reset-password/:token" component={ResetPassword} />
        <UnauthRoute exact path="/application-change/:token" component={ChangeRequest} />
        <UnauthRoute
          path="/login/callback/:token/:userId/:email/:verifiedAt"
          component={LoginCallBackPage}
        />
        <MainLayout>
          <Switch>
            <AuthenticatedRoute exact path="/conversation/:id?/:ticketId?" component={ChatbotComponent} />
            <AuthenticatedRoute exact path="/profile" component={Profile} />
            <AuthenticatedRoute exact path="/dashboard/:tab?/:page?" component={Dashboard} />
            <AuthenticatedRoute path="/" component={() => <Redirect to="/dashboard" />} />
          </Switch>
        </MainLayout>
        <UnauthRoute path="/" component={() => <Redirect to="/login" />} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isPageLoading: isPageLoading(state),
});

export default connect(mapStateToProps)(Router);
