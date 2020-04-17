import React, { useState, useEffect, useRef } from 'react';

const uri = process.env.REACT_APP_URI;

export const User = () => {

    const nameFocus = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [editing, setEditing] = useState(false);
    const [idUpdate, setIdUpdate] = useState('');

    const [users, setUsers] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editing) {
            await fetch(`${uri}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
        } else {
            await fetch(`${uri}/user/${idUpdate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            setEditing(false);
            setIdUpdate('');
        }

        nameFocus.current.focus();

        await getUsers();

        setName('');
        setEmail('');
        setPassword('');
    }

    const getUsers = async () => {
        const res = await fetch(`${uri}/users`);
        const data = await res.json();
        setUsers(data);
    }

    const deleteUser = async (id) => {
        const userResponse = window.confirm('Are you sure want to delete it?');

        if (userResponse) {
            await fetch(`${uri}/user/${id}`, {
                method: 'DELETE'
            });

            await getUsers();
        }
    }

    const editUser = async (id) => {
        const res = await fetch(`${uri}/user/${id}`);
        const data = await res.json();

        setEditing(true);

        setIdUpdate(id);
        setName(data.name);
        setEmail(data.email);
        setPassword(data.password);
    }

    useEffect(() => {
        getUsers();
    }, [])


    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <input
                            ref={nameFocus}
                            type="text"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            className="form-control"
                            placeholder="Type your name..."
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            className="form-control"
                            placeholder="example290123@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className="form-control"
                            placeholder="*************"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block">
                            {editing ? 'SAVE UPDATE' : 'CREATE NEW'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="col-md-8">
                <table className="table table-bordered table-dark">
                    <thead className="thead-dark text-center text-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center text-light">
                        {
                            users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm btn-block"
                                            onClick={() => editUser(user._id)}
                                        >EDIT</button>
                                        <button
                                            className="btn btn-danger btn-sm btn-block"
                                            onClick={() => deleteUser(user._id)}
                                        >DELETE</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}