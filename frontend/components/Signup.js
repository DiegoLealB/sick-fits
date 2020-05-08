import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
        signup(email: $email, name: $name, password: $password) {
            id
            email
            name
        }
    }
`;

class Signup extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
    }
    saveToState = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    render() {
        return (
            <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
                {(signup, {error, loading}) => {
                 return (
                 <Form method="post" onSubmit={(e) => {
                    e.preventDefault();
                    signup();
                }}>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <h2>Sign Up for an Account</h2>
                        <Error error={error} />

                        <label htmlFor="name">
                            Name
                            <input
                            type="name"
                            name="name" 
                            placeholder="Name" 
                            value={this.state.name} 
                            onChange={this.saveToState} 
                            />
                        </label>

                        <label htmlFor="confirm">
                            Email
                            <input
                            type="email"
                            name="email" 
                            placeholder="Email" 
                            value={this.state.email} 
                            onChange={this.saveToState} 
                            />
                        </label>

                        <label htmlFor="password">
                            Password
                            <input
                            type="password"
                            name="password" 
                            placeholder="password" 
                            value={this.state.password} 
                            onChange={this.saveToState} 
                            />
                        </label>

                        <button type="submit">Signup</button>
                    </fieldset>
                </Form>
                 );
                }}
            </Mutation>
        );
    }
}

export default Signup;