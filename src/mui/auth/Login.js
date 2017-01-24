import React, { Component, PropTypes } from 'react';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import compose from 'recompose/compose';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Card, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import { cyan500, pinkA200 } from 'material-ui/styles/colors';

import defaultTheme from '../defaultTheme';
import Translate from '../../i18n/Translate';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cyan500,
    },
    card: {
        minWidth: 300,
    },
    avatar: {
        margin: '1em',
        textAlign: 'center ',
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        display: 'flex',
    },
};

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>
    <TextField
        errorText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { signInError: false };
    }

    login = ({ username, password }) => {
        const { loginClient, push, location } = this.props;
        loginClient(username, password)
            .then(() => push(location.state ? location.state.nextPathname : '/'))
            .catch(e => this.setState({ signInError: e }));
    }

    render() {
        const { handleSubmit, submitting, theme, translate } = this.props;
        const { signInError } = this.state;
        const muiTheme = getMuiTheme(theme);
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.main}>
                    <Card className="sign-in" style={styles.card}>
                        <div style={styles.avatar}>
                            <Avatar backgroundColor={pinkA200} icon={<LockIcon />} size={60} />
                        </div>
                        {signInError && <Snackbar open autoHideDuration={4000} message={signInError.message || signInError || translate('aor.auth.sign_in_error')} />}

                        <form onSubmit={handleSubmit(this.login)}>
                            <div style={styles.form}>
                                <div style={styles.input} >
                                    <Field
                                        name="username"
                                        component={renderInput}
                                        floatingLabelText={translate('aor.auth.username')}
                                    />
                                </div>
                                <div style={styles.input}>
                                    <Field
                                        name="password"
                                        component={renderInput}
                                        floatingLabelText={translate('aor.auth.password')}
                                        type="password"
                                    />
                                </div>
                            </div>
                            <CardActions>
                                <RaisedButton type="submit" primary disabled={submitting} label={translate('aor.auth.sign_in')} fullWidth />
                            </CardActions>
                        </form>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}

Login.propTypes = {
    ...propTypes,
    previousRoute: PropTypes.string,
    loginClient: PropTypes.func,
    theme: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
};

Login.defaultProps = {
    theme: defaultTheme,
};

const enhance = compose(
    Translate,
    reduxForm({
        form: 'signIn',
        validate: (values, props) => {
            const errors = {};
            const { translate } = props;
            if (!values.username) errors.username = translate('aor.validation.required');
            if (!values.password) errors.password = translate('aor.validation.required');
            return errors;
        },
    }),
    connect(null, { push: pushAction }),
);

export default enhance(Login);