import React, { Component } from 'react';
import { Route } from 'react-router-dom';


const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

// const PrivateRoute = ({ component, redirectTo, ...rest }) => {
//   return (
//     <Route {...rest} render={routeProps => {
//       return auth.loggedIn() ? (
//         renderMergedProps(component, routeProps, rest)
//       ) : (
//         <Redirect to={{
//           pathname: redirectTo,
//           state: { from: routeProps.location }
//         }}/>
//       );
//     }}/>
//   );
// };

export default PropsRoute;
