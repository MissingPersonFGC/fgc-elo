import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import { auth } from "../firebase";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    error: false,
    success: false,
    message: null,
    loading: false
  };

  changeState = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  submitForm = async e => {
    e.preventDefault();
    await this.setState({
      loading: true
    });
    const { email, password } = this.state;
    let user = null;
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(success => {
        user = success.user;
        this.setState({
          success: true,
          loading: false
        });
      })
      .catch(err => {
        const { message } = err;
        this.setState({
          message,
          error: true,
          loading: false
        });
      });
    if (!this.state.error) {
      this.props.doLogin(user);
    }
  };

  render() {
    if (this.state.success) {
      return <Redirect to="/" />;
    }
    return (
      <section className="login">
        <Helmet>
          <title>{"Login | Sailor Moon S Global Rankings"}</title>
        </Helmet>
        <h3>Login</h3>
        <form onSubmit={this.submitForm}>
          <fieldset
            aria-busy={this.state.loading}
            disabled={this.state.loading}
          >
            {this.state.error && (
              <p className="error-message">
                <span>Error!</span> {this.state.message}
              </p>
            )}
            <label htmlFor="email">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={this.changeState}
                value={this.state.email}
              />
            </label>
            <label htmlFor="password">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.changeState}
                value={this.state.password}
              />
            </label>
            <input type="submit" value="Sign In" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default Login;
