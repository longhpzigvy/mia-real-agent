import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { ROLES } from '../../../../common/enums';

const AuthenticatedRoute = ({
  authenticated,
  userRole,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      const toAdminObj = {
        pathname: '/admin',
        state: { from: props.location },
      };

      if (authenticated) {
        if (userRole === ROLES.ADMIN) return <Redirect to={toAdminObj} />;
        return <Component {...props} authenticated />;
      }
      const toObj = {
        pathname: '/login',
        state: { from: props.location },
      };

      if (!authenticated) return <Redirect to={toObj} />;
      return <Redirect to="/error/404" />;
    }}
  />
);

AuthenticatedRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  userRole: PropTypes.string,
  component: PropTypes.any,
  location: PropTypes.any,
};

export default AuthenticatedRoute;
